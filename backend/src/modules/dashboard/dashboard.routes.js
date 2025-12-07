// backend/src/modules/dashboard/dashboard.routes.js
import {
  getOwnerDashboardSummaryHandler,
  getOwnerRevenueStatsHandler,
  getOwnerBookingStatsHandler,
  getOwnerBookingStatusHandler,
} from "./dashboard.controller.js";

import { requireAuth } from "../../shared/middlewares/requireAuth.js";

export async function dashboardRoutes(app, opts) {
  // 1. Summary (đã có – mở rộng)
  app.get(
    "/owner/dashboard/summary",
    { preHandler: [requireAuth] },
    getOwnerDashboardSummaryHandler
  );

  // 2. Revenue line chart
  app.get(
    "/owner/dashboard/revenue",
    { preHandler: [requireAuth] },
    getOwnerRevenueStatsHandler
  );

  // 3. Booking per time-block (bar chart)
  app.get(
    "/owner/dashboard/bookings",
    { preHandler: [requireAuth] },
    getOwnerBookingStatsHandler
  );

  // 4. Booking status donut chart
  app.get(
    "/owner/dashboard/booking-status",
    { preHandler: [requireAuth] },
    getOwnerBookingStatusHandler
  );
}
