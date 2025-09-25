const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
      minLength: [3, "Property name must be at least 3 characters long"],
      unique: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    rooms: {
      type: String,
      default: "",
      required: true,
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
    airbnbUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Properties", propertySchema);
