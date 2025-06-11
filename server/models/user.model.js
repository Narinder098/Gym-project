import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      street: String,
      state: String,
      city: String,
      country: String,
      postalCode: Number,
    },
    opt: {
      type: Number,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    membershipType: {
      type: String,
      enum: ["Basic", "Premium", "Pro"],
      default: "Basic",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;