import mongoose from "mongoose";
const { Schema } = mongoose;

const addonSchema = new Schema(
  {
    // Mã nội bộ, trùng với id FE đang dùng: "balls", "racket-rent", ...
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // equipment | drink | support (dụng cụ, đồ uống, phụ trợ)
    category: {
      type: String,
      required: true,
      enum: ["equipment", "drink", "support"],
    },

    // Nhãn tiếng Việt hiển thị UI: "Dụng cụ", "Đồ uống", ...
    categoryLabel: {
      type: String,
      required: true,
      trim: true,
    },

    // Giá theo đơn vị VND
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Đường dẫn ảnh (relative path trong /public/booking)
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

addonSchema.index({ category: 1, isActive: 1 });

export const Addon =
  mongoose.models.Addon || mongoose.model("Addon", addonSchema);
