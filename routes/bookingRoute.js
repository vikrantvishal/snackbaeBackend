const express = require("express");
const router = express.Router();

// Import controllers
const {
  createBooking,
  editBooking,
 
  deleteBooking,
} = require("../Controllers/booking");

// Routes
router.post("/bookings/:userId/:restaurantId", createBooking);
router.put("/bookings/:bookingId", editBooking);
router.delete("/bookings/:bookingId", deleteBooking);

module.exports = router;
