// backend/src/modules/bookings/booking.routes.js
import {
  createBookingHandler,
  getVenueAvailabilityHandler,
} from "./booking.controller.js";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";

export async function bookingRoutes(app, opts) {

  //   POST /api/bookings
  //   GET  /api/venues/:venueId/availability

  // Tạo booking
  app.post(
    "/bookings",
    createBookingHandler
  );

  // Availability theo venue + ngày
  app.get(
    "/venues/:venueId/availability",
    getVenueAvailabilityHandler
  );
}
