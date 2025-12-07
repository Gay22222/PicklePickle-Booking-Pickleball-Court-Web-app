// backend/src/modules/dashboard/dashboard.service.js
import mongoose from "mongoose";
import { Venue } from "../../models/venue.model.js";
import { Court } from "../../models/court.model.js";
import { Booking } from "../../models/booking.model.js";
import { BookingSlot } from "../../models/bookingSlot.model.js";

// ================== OWNER SUMMARY ==================
export async function getOwnerDashboardSummary(ownerId) {
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

  // Lấy danh sách venue của owner + trạng thái isActive
  const venues = await Venue.find(
    { manager: ownerObjectId },
    { _id: 1, isActive: 1 }
  ).lean();

  const venueIds = venues.map((v) => v._id);
  const totalVenueCount = venues.length;
  const activeVenueCount = venues.filter((v) => v.isActive !== false).length;

  // % sân (venue) đang hoạt động
  const activeVenuePercent =
    totalVenueCount > 0
      ? (activeVenueCount / totalVenueCount) * 100
      : 0;

  // Nếu chưa có venue nào thì trả luôn 0, nhưng vẫn trả activeVenuePercent
  if (!venueIds.length) {
    return {
      totalRevenueThisMonth: 0,
      growthPercent: 0,
      totalBookingsThisMonth: 0,
      activeVenuePercent,
    };
  }

  // ----- Doanh thu & lượt đặt trong tháng này / tháng trước -----
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );

  const [thisMonth, lastMonth] = await Promise.all([
    Booking.aggregate([
      {
        $match: {
          venue: { $in: venueIds },
          createdAt: { $gte: thisMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
        },
      },
    ]),
    Booking.aggregate([
      {
        $match: {
          venue: { $in: venueIds },
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]),
  ]);

  const revenueThisMonth = thisMonth[0]?.totalRevenue || 0;
  const bookingsThisMonth = thisMonth[0]?.totalBookings || 0;
  const revenueLastMonth = lastMonth[0]?.totalRevenue || 0;

  const growthPercent =
    revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0;

  return {
    totalRevenueThisMonth: revenueThisMonth,
    growthPercent,
    totalBookingsThisMonth: bookingsThisMonth,
    activeVenuePercent,
  };
}

// ================== REVENUE LINE CHART ==================
export async function getOwnerRevenueStats(ownerId, { range, from, to }) {
  const { from: start, to: end } = resolveDateRange({ range, from, to });

  const venues = await Venue.find({ manager: ownerId }, { _id: 1 }).lean();
  const venueIds = venues.map((v) => v._id);

  const revenue = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        userCount: { $addToSet: "$user" },
      },
    },
    {
      $project: {
        month: "$_id.month",
        revenue: 1,
        activeUsers: { $size: "$userCount" },
      },
    },
    { $sort: { month: 1 } },
  ]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return {
    months: months.map((m) => `T${m}`),
    revenue: months.map(
      (m) => revenue.find((r) => r.month === m)?.revenue || 0
    ),
    activeUsers: months.map(
      (m) => revenue.find((r) => r.month === m)?.activeUsers || 0
    ),
  };
}

// ================== BOOKING SLOTS BAR CHART ==================
export async function getOwnerBookingStats(ownerId, { range, from, to }) {
  const { from: start, to: end } = resolveDateRange({ range, from, to });

  const venues = await Venue.find(
    { manager: ownerId },
    { _id: 1, slotMinutes: 1 }
  ).lean();
  const venueIds = venues.map((v) => v._id);

  const slotMinutes = venues[0]?.slotMinutes || 60;

  const slots = await BookingSlot.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: "courts",
        localField: "court",
        foreignField: "_id",
        as: "court",
      },
    },
    { $unwind: "$court" },
    {
      $match: {
        "court.venue": { $in: venueIds },
      },
    },
    {
      $group: {
        _id: "$slotIndex",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Convert slotIndex → time-block
  const data = slots.map((s) => {
    const startHour = 5 + s._id * (slotMinutes / 60);
    const endHour = startHour + 2;
    return {
      label: `${String(startHour).padStart(2, "0")}-${String(
        endHour
      ).padStart(2, "0")}`,
      value: s.count,
    };
  });

  return data;
}

// ================== BOOKING STATUS DONUT ==================
export async function getOwnerBookingStatus(ownerId, { range, from, to }) {
  const { from: start, to: end } = resolveDateRange({ range, from, to });

  const venues = await Venue.find({ manager: ownerId }, { _id: 1 }).lean();
  const venueIds = venues.map((v) => v._id);

  const statuses = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: "bookingstatuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $group: {
        _id: "$status.code",
        count: { $sum: 1 },
      },
    },
  ]);

  const completed = statuses.find((s) => s._id === "COMPLETED")?.count || 0;
  const cancelled =
    (statuses.find((s) => s._id === "CANCELLED")?.count || 0) +
    (statuses.find((s) => s._id === "NO_SHOW")?.count || 0);

  return [
    { name: "Hoàn thành", value: completed },
    { name: "Đã huỷ", value: cancelled },
  ];
}

// ================== RANGE HELPER ==================
function resolveDateRange({ range, from, to }) {
  const now = new Date();

  // Custom range
  if (from && to) return { from: new Date(from), to: new Date(to) };

  let start, end;

  switch (range) {
    case "week": {
      const day = now.getDay() || 7; // Monday-based
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 7);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    }

    case "year":
    default: {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    }
  }

  return { from: start, to: end };
}
