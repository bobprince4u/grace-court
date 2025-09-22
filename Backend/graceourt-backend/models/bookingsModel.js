const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Guest reference is required"],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property reference is required"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room reference is required"],
    },
    checkInDate: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check-out date is required"],
      validate: {
        validator: function (value) {
          return value > this.checkInDate;
        },
        message: "Check-out date must be after check-in date",
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      min: [0, "Total price cannot be negative"],
    },
    guestCount: {
      type: Number,
      min: [1, "At least one guest is required"],
      default: 1,
    },
    specialRequest: {
      type: String,
      trim: true,
      maxLength: [600, "Special request cannot exceed 600 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingsSchema);
