import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email:     { type: String, required: true, unique: true, lowercase: true },
    fullName:  { type: String },
    phone:     { type: String },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
