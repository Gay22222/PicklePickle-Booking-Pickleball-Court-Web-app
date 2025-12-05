import {
  createCheckoutHandler,
  momoIpnHandler,
  vnpayIpnHandler,
} from "./payment.controller.js";

async function paymentRoutes(app, opts) {
  // POST /api/payments/checkout
  app.post("/payments/checkout", createCheckoutHandler);

  // MoMo IPN (POST)
  app.post("/payments/momo/ipn", momoIpnHandler);

  // VNPay IPN (GET)
  app.get("/payments/vnpay/ipn", vnpayIpnHandler);
}

export default paymentRoutes;
