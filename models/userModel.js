const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  profile: {
    type: String,
    default: 'default profile.png',
  },
  name: {
    type: String,
    required: [true, 'A user must have a name '],
    unique: true,
    locawercase: true,
  },
  useremail: {
    type: String,
    required: [true, 'Please provide your email '],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a vaild email'],
  },
  userphone: {
    type: String,
    required: [true, 'Please provide a number '],
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE AND SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same !',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this funcation if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the passowrd with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm feild
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
