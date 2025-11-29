// src/modules/courts/court.service.js
import mongoose from "mongoose";
import { Venue } from "../../models/venue.model.js";
import { PriceRule } from "../../models/priceRule.model.js";

export async function getVenueDetail(venueId) {
  console.log("[getVenueDetail] venueId =", venueId);

  // 1. Validate ObjectId
  if (!mongoose.isValidObjectId(venueId)) {
    console.log("[getVenueDetail] invalid ObjectId");
    return null;
  }

  // 2. Log tổng số venue & venue này
  const total = await Venue.countDocuments();
  console.log("[getVenueDetail] total venues =", total);

  const venue = await Venue.findById(venueId).lean();
  console.log("[getVenueDetail] venue =", venue && venue.name);

  if (!venue) return null;

  const priceRules = await PriceRule.find({ venue: venueId })
    .sort({ dayOfWeekFrom: 1, timeFrom: 1 })
    .lean();
  // HERO data
  const court = {
    id: venue._id.toString(),
    name: venue.name,
    address: venue.address,
    phone: venue.phone || "Đang cập nhật",
    description: venue.description,
    heroImages:
      (venue.images || []).map((img) => img.url) || [
        "/courts/sample1.png",
        "/courts/sample2.png",
        "/courts/sample3.png",
      ],
  };

  // OVERVIEW
  const overview = {
    featureLeft: venue.featuresLeft || [],
    featureRight: venue.featuresRight || [],
    amenitiesLeft: venue.amenitiesLeft || [],
    amenitiesRight: venue.amenitiesRight || [],
    featureImages: venue.featureImages || [],
    amenityImages: venue.amenityImages || [],
    logoSrc: "/courts/Logo.svg",
  };

  // PRICING – group giống format CourtPricingSection
  const grouped = {};
  for (const r of priceRules) {
    if (!grouped[r.dayLabel]) grouped[r.dayLabel] = [];
    grouped[r.dayLabel].push({
      time: `${r.timeFrom.replace(":00", "h")} - ${r.timeTo.replace(
        ":00",
        "h"
      )}`,
      fixed: `${r.fixedPricePerHour.toLocaleString("vi-VN")}đ/h`,
      walkin: `${r.walkinPricePerHour.toLocaleString("vi-VN")}đ/h`,
    });
  }

  const pricing = {
    title: `Bảng giá sân ${venue.name}`,
    rows: Object.entries(grouped).map(([day, slots]) => ({
      day,
      slots,
    })),
  };

  return { court, overview, pricing };
}
