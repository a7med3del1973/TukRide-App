const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');

// POST route for sending a message
router.post('/send', sendMessage);

// GET route for retrieving chat messages for a ride
router.get('/:rideId', getMessages);

module.exports = router;
