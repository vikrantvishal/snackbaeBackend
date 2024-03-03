const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  fullName: {
    type: String,
    trim: true,
  },
  Anniversary: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
