// backend/src/modules/dashboard/dashboard.routes.js
import { getOwnerDashboardSummaryHandler } from "./dashboard.controller.js";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";

export async function dashboardRoutes(app, opts) {
  // GET /api/owner/dashboard/summary
  app.get(
    "/owner/dashboard/summary",
    { preHandler: [requireAuth] },
    getOwnerDashboardSummaryHandler
  );
}
