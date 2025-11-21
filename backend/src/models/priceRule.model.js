import mongoose from "mongoose";
const { Schema } = mongoose;

const priceRuleSchema = new Schema(
  {
    venue:   { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    weekday: { type: Number },                 // optional: null = tất cả ngày
    timeFrom:{ type: String },                // "06:00"
    timeTo:  { type: String },                // "08:00"
    startDate: { type: Date },
    endDate:   { type: Date },
    amount:    { type: Number, required: true },
    note:      { type: String },
  },
  { timestamps: true }
);

export const PriceRule =
  mongoose.models.PriceRule ||
  mongoose.model("PriceRule", priceRuleSchema);
