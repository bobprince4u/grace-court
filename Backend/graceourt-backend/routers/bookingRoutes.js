const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
//router.get("/bookings", bookingController.getBookings);
//router.get("/bookings/:id", bookingController.getBookingById);
//router.put("/bookings/:id", bookingController.updateBooking);
//router.delete("/bookings/:id", bookingController.deleteBooking);

module.exports = router;
