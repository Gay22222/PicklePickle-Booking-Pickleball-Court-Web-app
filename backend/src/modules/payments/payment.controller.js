// src/modules/payments/payment.controller.js
import { createCheckout, handleMomoIpn, handleVnpayIpn } from "./payment.service.js";

// body: { paymentMethod: "MOMO" | "VNPAY" | "PAYPAL", bookingId: "<id>" }
export async function createCheckoutHandler(request, reply) {
  try {
    const payload = request.body || {};

    const clientIp =
      (request.headers["x-forwarded-for"] &&
        request.headers["x-forwarded-for"].split(",")[0].trim()) ||
      request.socket?.remoteAddress ||
      request.ip;

    
    const result = await createCheckout({ ...payload, clientIp });

    return reply.code(201).send({ data: result });
  } catch (err) {
    request.log.error(err, "createCheckoutHandler error");
    const statusCode = err.statusCode || 500;
    const message =
      err.statusCode && err.message
        ? err.message
        : "Failed to create payment checkout";
    return reply.code(statusCode).send({ message });
  }
}

// IPN từ MoMo gọi về
export async function momoIpnHandler(request, reply) {
  try {
    await handleMomoIpn(request.body);
    return reply.code(200).send({ message: "ok" });
  } catch (err) {
    request.log.error(err, "momoIpnHandler error");
    return reply.code(400).send({ message: err.message || "Invalid IPN" });
  }
}

// IPN từ VNPay gọi về (method: GET)
export async function vnpayIpnHandler(request, reply) {
  try {
    const result = await handleVnpayIpn(request.query);
    return reply.code(200).send(result);
  } catch (err) {
    request.log.error(err, "vnpayIpnHandler error");
    return reply
      .code(400)
      .send({ RspCode: "99", Message: err.message || "Invalid VNPay IPN" });
  }
}
