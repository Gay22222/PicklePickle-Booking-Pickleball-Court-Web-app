// backend/src/modules/bookings/booking.controller.js
import {
  createBookingFromSlots,
  getVenueAvailability,
  SlotConflictError,
} from "./booking.service.js";

// POST /api/bookings
export async function createBookingHandler(request, reply) {
  try {
    const body = request.body || {};

    
    const authUser = request.user || {};
    const userId = authUser.id || authUser._id; 

    if (!userId) {
      return reply
        .code(401)
        .send({ message: "Bạn phải đăng nhập trước khi đặt sân." });
    }

    const payload = {
      userId,
      venueId: body.venueId,
      date: body.date,
      courts: body.courts,
      discount: body.discount,
      note: body.note,
    };

    const result = await createBookingFromSlots(payload);

    return reply.code(201).send({
      data: {
        bookingId: result.booking._id,
        code: result.booking.code,
        grossAmount: result.booking.grossAmount,
        discount: result.booking.discount,
        totalAmount: result.booking.totalAmount,
        status: "PENDING_PAYMENT",
        items: result.items.map((item) => ({
          id: item._id,
          courtId: item.court._id,
          courtName: item.court.name,
          date: item.date,
          slotStart: item.slotStart,
          slotEnd: item.slotEnd,
          unitPrice: item.unitPrice,
          lineAmount: item.lineAmount,
        })),
      },
    });
  } catch (err) {
    request.log.error(err);

    if (err instanceof SlotConflictError) {
      return reply.code(409).send({
        message:
          err.message ||
          "Một hoặc nhiều khung giờ bạn chọn đã được người khác đặt. Vui lòng chọn lại.",
        conflicts: err.conflicts,
      });
    }

    return reply.code(500).send({
      message: "Không thể tạo booking. Vui lòng thử lại sau.",
    });
  }
}

// GET /api/venues/:venueId/availability?date=YYYY-MM-DD
export async function getVenueAvailabilityHandler(request, reply) {
  try {
    const { venueId } = request.params;
    const { date } = request.query;

    if (!date) {
      return reply
        .code(400)
        .send({ message: "Query param 'date' (YYYY-MM-DD) is required" });
    }

    const data = await getVenueAvailability({ venueId, dateStr: date });

    return reply.code(200).send({ data });
  } catch (err) {
    request.log.error(err);
    return reply
      .code(500)
      .send({ message: "Không lấy được availability của venue" });
  }
}
