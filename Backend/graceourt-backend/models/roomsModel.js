const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property reference is required"],
    },
    roomType: {
      type: String,
      required: [true, "Room Type is required"],
      trim: true,
      enum: ["standard", "deluxe", "suite"],
    },
    price: {
      type: Number,
      required: [true, "Room price is required"],
      minLength: [0, "Price cannot be negative"],
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [600, "Description cannot exceed 600 characters"],
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // <-- important: include virtuals in JSON
    toObject: { virtuals: true }, // <-- same for plain objects
  }
);

// Virtual field for property name
roomsSchema.virtual("propertyName").get(function () {
  // This will only work if the property has been populated
  if (this.propertyId && this.propertyId.name) {
    return this.propertyId.name;
  }
  return null;
});

module.exports = mongoose.model("Room", roomsSchema);
