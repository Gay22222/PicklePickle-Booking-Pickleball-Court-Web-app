// backend/src/modules/bookings/booking.service.js
import { Booking } from "../../models/booking.model.js";
import { BookingItem } from "../../models/bookingItem.model.js";
import { BookingSlot } from "../../models/bookingSlot.model.js";
import { BookingStatus } from "../../models/bookingStatus.model.js";
import { Court } from "../../models/court.model.js";
import { Venue } from "../../models/venue.model.js";
import { VenueOpenHour } from "../../models/venueOpenHour.model.js";
import { VenueHoliday } from "../../models/venueHoliday.model.js";
import { BlackoutSlot } from "../../models/blackoutSlot.model.js";
import { Payment } from "../../models/payment.model.js";

// ================== Helpers chung ==================

function generateBookingCode() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BK${datePart}-${randomPart}`;
}

// slotIndices -> nhóm các đoạn liên tiếp [start, end]
function groupContinuousSlots(slotIndices) {
  const sorted = [...new Set(slotIndices)].sort((a, b) => a - b);
  if (sorted.length === 0) return [];

  const segments = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
    } else {
      segments.push({ start, end: prev });
      start = cur;
      prev = cur;
    }
  }
  segments.push({ start, end: prev });
  return segments;
}

// Đổi "HH:mm" -> số phút
function timeStrToMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

// Đổi phút -> "HH:mm"
function minutesToTimeStr(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Rule mock giá (giống FE): slotIndex = giờ (05–22)
function getPricePerHourFromSlotIndex(slotIndex) {
  const hour = slotIndex;
  if (hour >= 5 && hour < 9) return 100000;
  if (hour >= 9 && hour < 16) return 120000;
  if (hour >= 16 && hour < 23) return 150000;
  return 120000;
}

// ================== Error custom ==================

export class SlotConflictError extends Error {
  constructor(message = "Some slots are already taken", conflicts = []) {
    super(message);
    this.name = "SlotConflictError";
    this.conflicts = conflicts; // [{ courtId, slotIndex }]
  }
}

// ================== Service: tạo booking + giữ slot ==================


export async function createBookingFromSlots(payload) {
  const { userId, venueId, date, courts, discount = 0, note } = payload;

  if (!userId) throw new Error("userId is required");
  if (!venueId) throw new Error("venueId is required");
  if (!date) throw new Error("date is required");
  if (!Array.isArray(courts) || courts.length === 0) {
    throw new Error("courts array is required");
  }

  const bookingDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(bookingDate.getTime())) {
    throw new Error("Invalid date format, expected YYYY-MM-DD");
  }

  // Check venue
  const venue = await Venue.findById(venueId);
  if (!venue) throw new Error("Venue not found");

  // Check courts thuộc venue
  const courtIds = courts.map((c) => c.courtId);
  const courtDocs = await Court.find({ _id: { $in: courtIds }, venue: venueId });
  if (courtDocs.length !== courtIds.length) {
    throw new Error("Some courts do not belong to the venue");
  }

  // Lấy status "PENDING_PAYMENT" (hoặc code bạn đã seed)
  const pendingStatus = await BookingStatus.findOne({ code: "PENDING" });
  if (!pendingStatus) {
    throw new Error("BookingStatus with code PENDING_PAYMENT not found");
  }

  const bookingCode = generateBookingCode();

  // 1) Tạo booking header
  const booking = await Booking.create({
    code: bookingCode,
    user: userId,
    venue: venueId,
    status: pendingStatus._id,
    grossAmount: 0,
    discount: discount || 0,
    totalAmount: 0,
    note: note || "",
  });

  // 2) Tạo BookingSlot cho từng slot
  const bookingSlotsDocs = [];
  for (const c of courts) {
    const { courtId, slotIndices } = c;
    if (!Array.isArray(slotIndices) || slotIndices.length === 0) continue;

    for (const slotIndex of slotIndices) {
      bookingSlotsDocs.push({
        booking: booking._id,
        court: courtId,
        date: bookingDate,
        slotIndex,
      });
    }
  }

  try {
    await BookingSlot.insertMany(bookingSlotsDocs, { ordered: true });
  } catch (err) {
    if (err && err.code === 11000) {
      // Tìm ra các slot đã tồn tại (bị trùng)
      const conflictConditions = bookingSlotsDocs.map((doc) => ({
        court: doc.court,
        date: doc.date,
        slotIndex: doc.slotIndex,
      }));

      const existing = await BookingSlot.find({
        $or: conflictConditions,
      }).lean();

      // Dọn rác
      await BookingSlot.deleteMany({ booking: booking._id });
      await Booking.deleteOne({ _id: booking._id });

      const conflicts = existing.map((s) => ({
        courtId: s.court.toString(),
        slotIndex: s.slotIndex,
      }));

      throw new SlotConflictError(
        "Một hoặc nhiều khung giờ bạn chọn đã có người giữ chỗ.",
        conflicts
      );
    }

    // Lỗi khác: dọn rác
    await BookingSlot.deleteMany({ booking: booking._id });
    await Booking.deleteOne({ _id: booking._id });
    throw err;
  }

  // 3) BookingItem: gom theo court + segment liên tiếp
  let grossAmount = 0;
  const bookingItemsDocs = [];

  for (const c of courts) {
    const { courtId, slotIndices, unitPricePerHour } = c;
    if (!Array.isArray(slotIndices) || slotIndices.length === 0) continue;

    const segments = groupContinuousSlots(slotIndices);

    for (const seg of segments) {
      const hoursCount = seg.end - seg.start + 1;
      const pricePerHour =
        typeof unitPricePerHour === "number"
          ? unitPricePerHour
          : getPricePerHourFromSlotIndex(seg.start);

      const lineAmount = pricePerHour * hoursCount;

      bookingItemsDocs.push({
        booking: booking._id,
        court: courtId,
        date: bookingDate,
        slotStart: seg.start,
        slotEnd: seg.end,
        unitPrice: pricePerHour,
        lineAmount,
      });

      grossAmount += lineAmount;
    }
  }

  if (bookingItemsDocs.length > 0) {
    await BookingItem.insertMany(bookingItemsDocs);
  }

  // 4) Update lại tiền trên Booking
  const finalGross = grossAmount;
  const finalDiscount = discount || 0;
  const finalTotal = finalGross - finalDiscount;

  booking.grossAmount = finalGross;
  booking.discount = finalDiscount;
  booking.totalAmount = finalTotal;
  await booking.save();

  const bookingItems = await BookingItem.find({ booking: booking._id })
    .populate("court")
    .lean();

  return {
    booking,
    items: bookingItems,
  };
}

// ================== Service: availability theo venue ==================

/**
 * Lấy availability cho toàn bộ court trong 1 venue theo ngày
 * - slotIndex ở đây = giờ (05–22) để match với FE hiện tại
 */
export async function getVenueAvailability({ venueId, dateStr }) {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date format, expected YYYY-MM-DD");
  }

  const venue = await Venue.findById(venueId);
  if (!venue) throw new Error("Venue not found");

  const courts = await Court.find({ venue: venueId, isActive: true }).lean();
  if (courts.length === 0) {
    return {
      venueId,
      date: dateStr,
      slotMinutes: venue.slotMinutes || 60,
      courts: [],
    };
  }

  const weekday = date.getDay(); // 0 (CN) - 6 (T7)

  // Check holiday
  const holiday = await VenueHoliday.findOne({ venue: venueId, date });

  // Lấy giờ mở cửa
  const openHour = await VenueOpenHour.findOne({ venue: venueId, weekday });

  if (!openHour || holiday) {
    return {
      venueId,
      date: dateStr,
      slotMinutes: venue.slotMinutes || 60,
      openTime: openHour?.timeFrom ?? null,
      closeTime: openHour?.timeTo ?? null,
      isHoliday: !!holiday,
      holidayReason: holiday?.reason ?? null,
      courts: courts.map((c) => ({
        courtId: c._id.toString(),
        courtName: c.name,
        slots: [],
      })),
    };
  }

  // slotIndex = giờ
  const firstSlotIndex = parseInt(openHour.timeFrom.slice(0, 2), 10);
  const lastSlotIndex = parseInt(openHour.timeTo.slice(0, 2), 10) - 1;

  const courtIds = courts.map((c) => c._id);

  // booking slot đã được giữ / đặt
  const bookingSlots = await BookingSlot.find({
    court: { $in: courtIds },
    date,
    slotIndex: { $gte: firstSlotIndex, $lte: lastSlotIndex },
  }).lean();

  const bookedSet = new Set(
    bookingSlots.map(
      (s) => `${s.court.toString()}#${s.slotIndex}`
    )
  );

  // blackout
  const blackouts = await BlackoutSlot.find({
    court: { $in: courtIds },
    date,
  }).lean();

  const blackoutSet = new Set();
  for (const b of blackouts) {
    for (let idx = b.slotStart; idx < b.slotEnd; idx += 1) {
      blackoutSet.add(`${b.court.toString()}#${idx}`);
    }
  }

  const slotMinutes = venue.slotMinutes || 60;

  const courtsWithSlots = courts.map((c) => {
    const slots = [];
    for (let idx = firstSlotIndex; idx <= lastSlotIndex; idx += 1) {
      const startMin = idx * 60; // vì 1 slot = 1h, đơn giản hoá
      const endMin = startMin + slotMinutes;

      let status = "available";
      const key = `${c._id.toString()}#${idx}`;
      if (bookedSet.has(key)) status = "booked";
      if (blackoutSet.has(key)) status = "blackout";

      slots.push({
        slotIndex: idx,
        timeFrom: minutesToTimeStr(startMin),
        timeTo: minutesToTimeStr(endMin),
        status,
        pricePerHour: getPricePerHourFromSlotIndex(idx),
      });
    }

    return {
      courtId: c._id.toString(),
      courtName: c.name,
      slots,
    };
  });

  return {
    venueId,
    date: dateStr,
    slotMinutes,
    weekday,
    openTime: openHour.timeFrom,
    closeTime: openHour.timeTo,
    isHoliday: false,
    holidayReason: null,
    courts: courtsWithSlots,
  };
}
/**
 * Lấy lịch sử đặt sân của 1 user
 * options: { userId, page, limit, statusCodes }
 */
export async function getUserBookingHistory({
  userId,
  page = 1,
  limit = 5,
  statusCodes,
}) {
  const query = { user: userId };

  // Nếu FE gửi filter theo status code (PENDING, PAID, CANCELLED...)
  if (Array.isArray(statusCodes) && statusCodes.length > 0) {
    const statusDocs = await BookingStatus.find({
      code: { $in: statusCodes },
    })
      .select("_id")
      .lean();

    if (statusDocs.length > 0) {
      query.status = { $in: statusDocs.map((s) => s._id) };
    }
  }

  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const pageSize = Number(limit) > 0 ? Number(limit) : 5;

  const [total, bookings] = await Promise.all([
    Booking.countDocuments(query),
    Booking.find(query)
      .populate("venue", "name address")
      .populate("status", "code label isFinal isCancel")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
  ]);

  if (bookings.length === 0) {
    return {
      page: pageNumber,
      limit: pageSize,
      total,
      items: [],
    };
  }

  const bookingIds = bookings.map((b) => b._id);

  // Lấy các slot + sân + payment cho các booking này
  const [bookingItems, payments] = await Promise.all([
    BookingItem.find({ booking: { $in: bookingIds } })
      .populate("court", "name")
      .lean(),
    Payment.find({ booking: { $in: bookingIds } })
      .populate("status", "code label isSuccess")
      .lean(),
  ]);

  const itemsByBooking = new Map();
  for (const item of bookingItems) {
    const key = item.booking.toString();
    if (!itemsByBooking.has(key)) itemsByBooking.set(key, []);
    itemsByBooking.get(key).push(item);
  }

  const paymentsByBooking = new Map();
  for (const p of payments) {
    const key = p.booking.toString();
    if (!paymentsByBooking.has(key)) paymentsByBooking.set(key, []);
    paymentsByBooking.get(key).push(p);
  }

  function slotIndexToTime(slotIndex) {
    // Giả sử slotIndex 0 = 05:00, mỗi slot = 60 phút.
    // Nếu backend của bạn quy ước khác, chỉnh lại cho khớp.
    const baseHour = 5;
    const hour = baseHour + Number(slotIndex || 0);
    const hh = String(hour).padStart(2, "0");
    return `${hh}:00`;
  }

  const items = bookings.map((b) => {
    const bookingId = b._id.toString();
    const bi = itemsByBooking.get(bookingId) || [];
    // Lấy slot đầu tiên làm đại diện (nếu có nhiều sân / nhiều khung thì tuỳ bạn mở rộng thêm)
    const firstItem = bi[0] || null;

    let date = null;
    let slotStart = null;
    let slotEnd = null;
    let courtName = null;

    if (firstItem) {
      date = firstItem.date;
      slotStart = firstItem.slotStart;
      slotEnd = firstItem.slotEnd;
      courtName = firstItem.court?.name || null;
    }

    const paymentList = paymentsByBooking.get(bookingId) || [];
    const successPayment = paymentList.find((p) => p.status?.isSuccess);
    const primaryPayment = successPayment || paymentList[0];

    const paymentStatusLabel =
      primaryPayment?.status?.label || "Chưa thanh toán";
    const paymentStatusCode = primaryPayment?.status?.code || "UNPAID";
    const paymentMethod = primaryPayment?.provider || null;

    // Format sẵn 2 chuỗi date/time đơn giản, FE có thể dùng luôn
    let dateLabel = "";
    let timeLabel = "";

    if (date instanceof Date) {
      // YYYY-MM-DD -> dd/MM/yyyy
      const d = date;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      dateLabel = `${dd}/${mm}/${yyyy}`;
    }

    if (slotStart != null && slotEnd != null) {
      const from = slotIndexToTime(slotStart);
      const to = slotIndexToTime(slotEnd + 1); // giả sử end là inclusive
      timeLabel = `${from} - ${to}`;
    }

    return {
      id: bookingId,
      code: b.code,
      venueName: b.venue?.name || "",
      venueAddress: b.venue?.address || "",
      courtName: courtName || "Sân chưa rõ",

      date: date, // Date object
      dateLabel,
      timeLabel,

      bookingStatusCode: b.status?.code || "",
      bookingStatusLabel: b.status?.label || "",
      bookingIsFinal: !!b.status?.isFinal,
      bookingIsCancel: !!b.status?.isCancel,

      paymentStatusCode,
      paymentStatusLabel,
      paymentMethod,

      totalAmount: b.totalAmount || 0,
      createdAt: b.createdAt,
    };
  });

  return {
    page: pageNumber,
    limit: pageSize,
    total,
    items,
  };
}