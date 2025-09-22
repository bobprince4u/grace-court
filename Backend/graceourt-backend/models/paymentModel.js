const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: String,
      ref: "Booking",
      required: [true, "Booking reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      minLength: [0, "Amount cannot be negative"],
    },
    method: {
      type: String,
      enum: ["credit_card", "bank_transfer", "cash", "stripe"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "faild", "refunded"],
      default: "Pending",
    },
    transaction: {
      type: String,
      trim: true,
      default: null, // if yoiu integrate with payment method
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
