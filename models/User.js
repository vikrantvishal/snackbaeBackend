const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 
contactNumber:{
    type: Number,
    trim: true,
},
additionalDetails:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },

});

module.exports = mongoose.model("User", userSchema);
