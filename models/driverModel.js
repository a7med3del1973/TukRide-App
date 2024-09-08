const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const driverSchema = new mongoose.Schema({
  profile: {
    type: String,
    default: 'default profile.png',
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  photo: String,
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    minlength: 11,
  },
  status: {
    type: Boolean,
    default: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
  licenseNumber: String,
  expirationDate: Date,
  dateOfBirth: Date,
  idCard: String,
  driverLicense: String,
});

// Middleware to hash passwords before saving
driverSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Set passwordChangedAt to the current date and time
  this.passwordChangedAt = new Date();

  // Delete passwordConfirmation field
  this.passwordConfirm = undefined;
  next();
});

// Method to compare passwords
driverSchema.methods.correctPassword = async function (
  candidatePassword,
  driverPassword
) {
  return await bcrypt.compare(candidatePassword, driverPassword);
};

// Method to check if password was changed after token was issued
driverSchema.methods.ChangedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

// Method to create a password reset token
driverSchema.methods.createPasswordResetToken = function () {
  // Generate a random 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetCode;
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
