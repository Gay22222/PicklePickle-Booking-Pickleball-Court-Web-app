// src/app.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config/env.js";
import { searchRoutes } from "./modules/search/search.routes.js";
import { courtRoutes } from "./modules/courts/court.routes.js";
import { bookingRoutes } from "./modules/bookings/booking.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import addonRoutes from "./modules/addons/addon.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import { startBookingExpirationJob } from "./jobs/bookingExpiration.job.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";



export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // CORS
  app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  });

  // Healthcheck cho Docker (wget http://localhost:4000/healthz)
  app.get("/healthz", async () => {
    return {
      ok: true,
      ts: Date.now(),
    };
  });

  app.register(searchRoutes, { prefix: config.apiPrefix });
  app.register(courtRoutes, { prefix: config.apiPrefix });
  app.register(bookingRoutes, { prefix: config.apiPrefix });
  app.register(authRoutes, { prefix: config.apiPrefix });
  app.register(addonRoutes, { prefix: config.apiPrefix });
  app.register(paymentRoutes, { prefix: config.apiPrefix });
  app.register(dashboardRoutes, { prefix: config.apiPrefix });

  startBookingExpirationJob();
  return app;
}
