const express = require("express");
const router = express.Router();

// Import controllers
const {
  createBooking,
  editBooking,
  getAllBookingsByRestaurant,
 
  deleteBooking,
} = require("../Controllers/booking");

// Routes
router.post("/bookings/:userId/:restaurantId", createBooking);
router.put("/bookings/:bookingId", editBooking);
router.delete("/bookings/:bookingId", deleteBooking);
router.get("/bookings/:restaurantId", getAllBookingsByRestaurant);

module.exports = router;
