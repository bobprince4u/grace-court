// models/testimonialModel.js
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minLength: [20, "Message must be at least 20 characters long"],
      maxLength: [1000, "Message cannot exceed 1000 characters"],
    },
    image: {
      type: String, // store S3 URL or local path
      default: null,
    },

    approved: {
      type: Boolean,
      default: false, // admin can approve
    },
    hidden: {
      type: Boolean,
      default: false, // admin can hide without deleting
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
