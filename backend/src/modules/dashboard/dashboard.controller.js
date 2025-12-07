import {
  getOwnerDashboardSummary,
  getOwnerRevenueStats,
  getOwnerBookingStats,
  getOwnerBookingStatus,
} from "./dashboard.service.js";

export async function getOwnerDashboardSummaryHandler(request, reply) {
  try {
    const ownerId = request.user.id;
    const data = await getOwnerDashboardSummary(ownerId);
    return reply.send({ data });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: "Không thể tải summary dashboard." });
  }
}

export async function getOwnerRevenueStatsHandler(request, reply) {
  try {
    const ownerId = request.user.id;
    const { range, from, to } = request.query;
    const data = await getOwnerRevenueStats(ownerId, { range, from, to });
    return reply.send({ data });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: "Không thể tải dữ liệu doanh thu." });
  }
}

export async function getOwnerBookingStatsHandler(request, reply) {
  try {
    const ownerId = request.user.id;
    const { range, from, to } = request.query;
    const data = await getOwnerBookingStats(ownerId, { range, from, to });
    return reply.send({ data });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: "Không thể tải dữ liệu đặt sân." });
  }
}

export async function getOwnerBookingStatusHandler(request, reply) {
  try {
    const ownerId = request.user.id;
    const { range, from, to } = request.query;
    const data = await getOwnerBookingStatus(ownerId, { range, from, to });
    return reply.send({ data });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: "Không thể tải trạng thái booking." });
  }
}
