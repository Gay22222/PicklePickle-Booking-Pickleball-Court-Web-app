// backend/src/modules/dashboard/dashboard.controller.js
import { getOwnerDashboardSummary } from "./dashboard.service.js";

export async function getOwnerDashboardSummaryHandler(request, reply) {
  try {
    const authUser = request.user || {};
    const ownerId = authUser.id || authUser._id;

    if (!ownerId) {
      return reply.code(401).send({ message: "Bạn phải đăng nhập." });
    }

    const data = await getOwnerDashboardSummary(ownerId);
    return reply.send({ data });
  } catch (err) {
    request.log.error(err);
    return reply
      .code(500)
      .send({ message: "Không thể tải dữ liệu dashboard." });
  }
}
