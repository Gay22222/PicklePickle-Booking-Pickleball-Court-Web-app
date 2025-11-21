import mongoose from "mongoose";
const { Schema } = mongoose;

const venueSchema = new Schema(
  {
    name:       { type: String, required: true },
    district:   { type: String },
    address:    { type: String },
    latitude:   { type: Number },
    longitude:  { type: Number },
    timeZone:   { type: String },
    slotMinutes:{ type: Number, default: 30 },
    manager:    { type: Schema.Types.ObjectId, ref: "User" }, // owner chính
  },
  { timestamps: true }
);

export const Venue =
  mongoose.models.Venue || mongoose.model("Venue", venueSchema);
