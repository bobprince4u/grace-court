const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true, // ✅ fixed typo
      minLength: [3, "Property name must be at least 3 characters long"],
      unique: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    rooms: {
      type: Number,
      default: 1,
      required: true,
      min: [1, "Property must have at least 1 room"], // ✅ fixed for numbers
    },
    amenities: {
      type: [String],
      default: [],
    },
    propertyImage: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
      default: "No description provided",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Properties", propertySchema); // ✅ singular for consistency
