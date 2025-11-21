// src/app.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config/env.js";

// sau này import các module routes ở đây
// import { registerAuthRoutes } from "./modules/auth/auth.routes.js";
// import { registerCourtRoutes } from "./modules/courts/court.routes.js";

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

  // TODO: register các module thực tế
  // app.register(registerAuthRoutes, { prefix: "/api/auth" });
  // app.register(registerCourtRoutes, { prefix: "/api/courts" });
  // app.register(registerBookingRoutes, { prefix: "/api/bookings" });
  // ...

  return app;
}
