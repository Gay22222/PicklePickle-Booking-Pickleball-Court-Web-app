// backend/src/models/venue.model.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const venueSchema = new Schema(
  {
    name:       { type: String, required: true },
    district:   { type: String },
    address:    { type: String },
    latitude:   { type: Number },
    longitude:  { type: Number },
    timeZone:   { type: String, default: "Asia/Ho_Chi_Minh" },
    slotMinutes:{ type: Number, default: 60 },

    manager:    { type: Schema.Types.ObjectId, ref: "User" }, // owner chính

    // ====== HERO / INFO ======
    phone:        { type: String },
    description:  { type: String },
    heroTagline:  { type: String }, // ví dụ: "Cụm 4 sân ngoài trời tại trung tâm Thủ Đức"

    basePricePerHour: { type: Number, default: 80000 },
    currency:         { type: String, default: "VND" },

    // ====== OVERVIEW / HIGHLIGHTS ======
    featuresLeft:    [{ type: String }],
    featuresRight:   [{ type: String }],
    amenitiesLeft:   [{ type: String }],
    amenitiesRight:  [{ type: String }],
    featureImages:   [{ type: String }],
    amenityImages:   [{ type: String }],

    // ====== Hình ảnh cho hero slider ======
    images: [
      {
        url:       { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Venue =
  mongoose.models.Venue || mongoose.model("Venue", venueSchema);
