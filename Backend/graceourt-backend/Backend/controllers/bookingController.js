const mongoose = require("mongoose");
const Booking = require("../models/bookingsModel");
const Property = require("../models/propertiesModel");
const Room = require("../models/roomsModel");

exports.createBooking = async (req, res) => {
  try {
    let {
      guest,
      property,
      room,
      checkInDate,
      checkOutDate,
      guestCount,
      specialRequest,
      totalPrice,
      manual,
    } = req.body;

    // --- Normalize/validate manual flag ---
    manual = manual === true || manual === "true";

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(guest) ||
      !mongoose.Types.ObjectId.isValid(property) ||
      !mongoose.Types.ObjectId.isValid(room)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid guest, property, or room ID",
      });
    }

    // Validate existence of property & room
    const foundProperty = await Property.findById(property);
    if (!foundProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const foundRoom = await Room.findById(room);
    if (!foundRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Optional: check if room is available for selected dates
    const overlapping = await Booking.findOne({
      room,
      checkOutDate: { $gte: new Date(checkInDate) },
      checkInDate: { $lte: new Date(checkOutDate) },
      status: { $in: ["pending", "confirmed"] },
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message: "Room not available for these dates",
      });
    }

    // Create booking
    const booking = new Booking({
      guest,
      property,
      room,
      checkInDate,
      checkOutDate,
      guestCount: guestCount || 1,
      specialRequest,
      totalPrice,
      status: manual ? "confirmed" : "pending",
      paymentStatus: manual ? "paid" : "pending",
    });

    const savedBooking = await booking.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
