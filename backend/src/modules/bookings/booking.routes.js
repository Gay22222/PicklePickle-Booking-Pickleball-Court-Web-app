// backend/src/modules/bookings/booking.routes.js
import {
  createBookingHandler,
  getVenueAvailabilityHandler,
  getUserBookingHistoryHandler,
} from "./booking.controller.js";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";

export async function bookingRoutes(app, opts) {
  //   POST /api/bookings
  //   GET  /api/venues/:venueId/availability

  // Tạo booking - BẮT BUỘC ĐĂNG NHẬP
  app.post(
    "/bookings",
    { preHandler: [requireAuth] },  
    createBookingHandler
  );

  // Availability theo venue + ngày
  app.get(
    "/venues/:venueId/availability",
    getVenueAvailabilityHandler
  );

  app.get(
    "/bookings/history",
    { onRequest: [requireAuth] },
    getUserBookingHistoryHandler
  );
}
