import { createCheckout } from "./payment.service.js";

export async function createCheckoutHandler(request, reply) {
  try {
    const payload = request.body; // { paymentMethod, bookingDraft }

    const result = await createCheckout(payload);

    return reply.code(201).send({ data: result });
  } catch (err) {
    request.log.error(err, "createCheckoutHandler error");
    return reply.code(500).send({ message: "Failed to create payment checkout" });
  }
}
