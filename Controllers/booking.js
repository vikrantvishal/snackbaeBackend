const Bookings = require("../models/bookingmodel");
const Guest = require("../models/guestmodel");
const { transport } = require("../util/utils");

//////////////////////
// GET ALL BOOKINGS //
//////////////////////
const getBookings = async (req, res) => {
  const bookings = await Bookings.find().populate("guest");
  res.status(200).json(bookings);
};
//////////////////
// SAVE BOOKING //
//////////////////
const createBooking = async (req, res) => {
  try {
    // Extract data from request body
    const { date, time, numofpeople } = req.body;

    // Extract user ID and restaurant ID from URL parameters
    const { userId, restaurantId } = req.params;

    // Check if the restaurant exists
    let restaurant = await RestaurantDetails.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Create a new booking
    const booking = new Booking({
      user: userId,
      restaurant: restaurantId,
      date,
      time,
      numofpeople,
    });

    // Save the booking to the database
    await booking.save();

    // Update restaurant details to include the booking and return the modified document
    restaurant = await RestaurantDetails.findByIdAndUpdate(
      restaurantId,
      { $push: { bookings: booking._id } },
      { new: true }
    );

    // Return success response
    res
      .status(201)
      .json({ message: "Booking created successfully", booking});
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//////////////////
// EDIT BOOKING //
//////////////////
const editBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const editedBooking = await Bookings.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        date: req.body.date,
        time: req.body.time,
        amount: req.body.amount,
        tables: req.body.tables,
        message: req.body.message,
      }
    );

    // Find guest information
    const getBooking = await Bookings.findById(id);
    const guestID = getBooking.guest;
    const foundGuest = await Guest.findById(guestID);
    console.log(foundGuest);
    // Send confirmation about updated reservation to guest
    transport(foundGuest.email, req.body.date, id);

    // Set 200 status and send response
    res.status(200).send(editedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

////////////////////
// DELETE BOOKING //
////////////////////
const deleteBooking = async (req, res) => {
  const id = req.params.id;

  try {
    // Find booking by ID and delete
    await Bookings.findById(id).deleteOne();
    res.status(200);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//////////////////////
// GET AVAILABILITY //
//////////////////////
const searchAvailability = async (req, res) => {
  const { date, time, amount, tables } = req.body;

  // Get all bookings from db
  const allBookings = await Bookings.find().lean();

  try {
    // Get existing reservations from requested day
    const requestedDate = allBookings.filter(
      (booking) => booking.date === date
    );
    // If there are no reservations on requested date, confirm booking
    if (requestedDate.length < 1) {
      res.status(200).send(true);
    } else {
      /* If there are bookings on requested date,
    check if there are any at the same time */
      for (let i = 0; i < requestedDate.length; i++) {
        // List of bookings on the same date and same time:
        const sameDayAndTime = requestedDate.filter(
          (booking) => booking.time === time
        );
        // If there are no bookings on requested time, confirm booking
        if (sameDayAndTime.length < 1) {
          res.status(200).send(true);
        } else {
          // Get list of bookings with same date & time:
          for (let j = 0; j < sameDayAndTime.length; j++) {
            // Get total amount of booked tables on same date & time
            const bookedTables = sameDayAndTime.reduce(function (a, b) {
              return a + b.tables;
            }, 0);
            // If 15 tables are already booked, decline booking request
            if (bookedTables + tables > 15) {
              res.status(200).send(false);
            } // If there are tables available, confirm booking
            else {
              res.status(200).send(true);
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(400);
  }
};

////////////////////////
// EMAIL CANCELLATION //
////////////////////////
const emailCancellation = async (req, res) => {
  const id = req.params.id;

  try {
    // Find booking in db and delete
    await Bookings.findById(id).deleteOne();
    res.status(200);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//////////////////////////////////////
// CLEAR BOOKINGS IN DB for Cypress //
//////////////////////////////////////
const clearBookings = async (req, res) => {
  await Bookings.deleteMany({});
  res.sendStatus(200);
};

module.exports = {
  createBooking,
  getBookings,
  editBooking,
  deleteBooking,
  searchAvailability,
  emailCancellation,
  clearBookings,
};
