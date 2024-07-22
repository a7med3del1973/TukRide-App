const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signupUser = async (req, res) => {};

exports.loginUser = (req, res) => {
  res.status(200).json({ message: 'User login not implemented yet.' });
};

exports.cancelRide = (req, res) => {
  res.status(200).json({ message: 'User cancelRide not implemented yet.' });
};

// give rate for the driver
exports.rateRide = (req, res) => {
  res.status(200).json({ message: 'User rateRide not implemented yet.' });
};
// show all availables rides
exports.availableRides = (req, res) => {
  res.status(200).json({ message: 'User availableRides not implemented yet.' });
};
// Book a ride
exports.bookRide = (req, res) => {
  res.status(200).json({ message: 'User bookRide not implemented yet.' });
};

exports.updateUserProfile = (req, res) => {
  res
    .status(200)
    .json({ message: 'User updateUserProfile not implemented yet.' });
};

exports.getUserProfile = (req, res) => {
  res.status(200).json({ message: 'User getUserProfile not implemented yet' });
};
// Get user ride history
exports.rideHistory = (req, res) => {
  res.status(200).json({ message: 'User rideHistory not implemented yet.' });
};

exports.deleteMe = (req, res) => {
  res.status(200).json({ message: 'User deleteMe not implemented yet.' });
};

exports.resizeUserPhoto = (req, res) => {
  res
    .status(200)
    .json({ message: 'User resizeUserPhoto not implemented yet.' });
};

exports.uploadUserPhoto = (req, res) => {
  res
    .status(200)
    .json({ message: 'User uploadUserPhoto not implemented yet.' });
};

exports.updatePassword = (req, res) => {
  res.status(200).json({ message: 'User updatePassword not implemented yet.' });
};
exports.resetPassword = (req, res) => {
  res.status(200).json({ message: 'User resetPassword not implemented yet.' });
};
exports.forgotPassword = (req, res) => {
  res.status(200).json({ message: 'User forgotPassword not implemented yet.' });
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'User logout not implemented yet .' });
};
