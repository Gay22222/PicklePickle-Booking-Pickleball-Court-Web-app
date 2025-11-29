import { createCheckoutHandler } from "./payment.controller.js";

async function paymentRoutes(fastify, opts) {
  // POST /api/payments/checkout
  fastify.post("/payments/checkout", createCheckoutHandler);
}

export default paymentRoutes;
