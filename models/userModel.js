const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must hava a name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user must hava an email"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "A user must hava an email"],
    unique: true,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
