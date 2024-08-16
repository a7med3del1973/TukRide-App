const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
// Password management routes
router.post('/forgotPassword', authController.forgotPasswordUser);
router.patch('/resetPassword/:token', authController.resetPasswordUser);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePasswordUser
);

// Authentication routes
router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.protect, authController.logout);
//
// User profile routes
//
router.use(authController.protect);
router.get('/profile', userController.getUserProfile);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// Ride management routes
router.get('/availableRides', userController.availableRides);
router.post('/bookRide', userController.bookRide);
router.delete('/cancelRide/:rideId', userController.cancelRide);
router.get('/rideHistory', userController.rideHistory);

// Ride rating route
router.post('/rateRide/:rideId', userController.rateRide);

module.exports = router;
