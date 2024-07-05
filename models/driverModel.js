const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the driver must have a name .'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'the driver must have a email .'],
    lowercase: true,
    // email validation
  },
  phone: {
    type: String,
    required: [true, 'the driver must have a phone .'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'the driver must have a password .'],
    minLength: [8, 'the passord must be at least 8 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangeAt: { type },
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
