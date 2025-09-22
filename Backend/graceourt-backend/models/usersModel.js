const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is Required"],
      trim: true,
      minLength: [3, "Full Name must be at least 3 characters Long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      minLength: [6, "Email must be at least 6 characters Long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
      uniquie: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "guest"], //restrict allowed role
      default: "guest",
    },
    profileImage: {
      type: String, // url
    },
    Permissions: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidation: {
      type: Number,
      select: false,
    },
    forgetPasswordCode: {
      type: String,
      select: false,
    },
    forgetPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
