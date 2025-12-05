// backend/src/modules/dashboard/dashboard.service.js
import mongoose from "mongoose";
import { Venue } from "../../models/venue.model.js";
import { Court } from "../../models/court.model.js";
import { Booking } from "../../models/booking.model.js";

export async function getOwnerDashboardSummary(ownerId) {
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

  // 1. Lấy danh sách sân (venue) do owner quản lý
  const venues = await Venue.find({ manager: ownerObjectId }, { _id: 1 }).lean();
  const venueIds = venues.map((v) => v._id);

  if (venueIds.length === 0) {
    return {
      totalActiveCourts: 0,
      todayBookings: 0,
      todayRevenue: 0,
    };
  }

  // 2. Tổng số sân (court) đang active
  const totalActiveCourts = await Court.countDocuments({
    venue: { $in: venueIds },
    isActive: true,
  });

  // 3. Thống kê booking / doanh thu hôm nay
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const agg = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        // TODO: nếu muốn chỉ lấy booking không bị hủy,
        // có thể $lookup sang BookingStatus rồi filter isCancel: false
      },
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const todayStats = agg[0] || { totalBookings: 0, totalRevenue: 0 };

  return {
    totalActiveCourts,
    todayBookings: todayStats.totalBookings,
    todayRevenue: todayStats.totalRevenue,
  };
}
