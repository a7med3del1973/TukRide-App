const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Driver = require('../models/driverModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (userOrDriver, statusCode, res) => {
  const token = signToken(userOrDriver._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  userOrDriver.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      userOrDriver,
    },
  });
};

// User signup
exports.signupUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    useremail: req.body.useremail,
    userphone: req.body.userphone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

// Driver signup
exports.signupDriver = catchAsync(async (req, res, next) => {
  const newDriver = await Driver.create({
    drivername: req.body.drivername,
    driveremail: req.body.driveremail,
    driverphone: req.body.driverphone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newDriver, 201, res);
});

// User login
exports.loginUser = catchAsync(async (req, res, next) => {
  const { useremail, password } = req.body;

  if (!useremail || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ useremail }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

// Driver login
exports.loginDriver = catchAsync(async (req, res, next) => {
  const { driveremail, password } = req.body;

  if (!driveremail || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const driver = await Driver.findOne({ driveremail }).select('+password');

  if (!driver || !(await driver.correctPassword(password, driver.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(driver, 200, res);
});

// User/Driver logout
exports.logout = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json({
      status: 'error',
      message: 'You are already logged out !',
    });
  }
  jwtBlacklist.add(token);
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'You are now logged out !',
  });
};

// Protect routes for both Users and Drivers
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedout') {
    return next(new AppError('You are logged out! Please log in again.', 401));
  }

  if (jwtBlacklist.has(token)) {
    return next(new AppError('You are logged out! Please log in again.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser =
    (await User.findById(decoded.id)) || (await Driver.findById(decoded.id));
  if (!currentUser) {
    return next(new AppError('The user/driver no longer exists.', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User/Driver recently changed password! Please log in again.',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// Forgot and reset password functions can be extended similarly for Drivers as for Users.
// Forgot password for User
exports.forgotPasswordUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ useremail: req.body.useremail });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/user/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.useremail,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

// Forgot password for Driver
exports.forgotPasswordDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findOne({ driveremail: req.body.driveremail });
  if (!driver) {
    return next(
      new AppError('There is no driver with that email address', 404)
    );
  }

  const resetToken = driver.createPasswordResetToken();
  await driver.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/driver/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: driver.driveremail,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    driver.passwordResetToken = undefined;
    driver.passwordResetExpires = undefined;
    await driver.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

// Reset password for User
exports.resetPasswordUser = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

// Reset password for Driver
exports.resetPasswordDriver = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const driver = await Driver.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!driver) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  driver.password = req.body.password;
  driver.passwordConfirm = req.body.passwordConfirm;
  driver.passwordResetToken = undefined;
  driver.passwordResetExpires = undefined;
  await driver.save();

  createSendToken(driver, 200, res);
});
// Update password for User
exports.updatePasswordUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

// Update password for Driver
exports.updatePasswordDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.user.id).select('+password');

  if (
    !(await driver.correctPassword(req.body.passwordCurrent, driver.password))
  ) {
    return next(new AppError('Your current password is wrong', 401));
  }

  driver.password = req.body.password;
  driver.passwordConfirm = req.body.passwordConfirm;
  await driver.save();

  createSendToken(driver, 200, res);
});
