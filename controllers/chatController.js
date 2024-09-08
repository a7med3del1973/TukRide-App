const Chat = require('../models/chatModel');

// Send message
const sendMessage = async (req, res) => {
  const { rideId, senderId, senderModel, receiverId, receiverModel, message } =
    req.body;

  try {
    const chatMessage = new Chat({
      rideId,
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      message,
    });

    await chatMessage.save();
    res.status(200).json({ success: true, data: chatMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get chat messages for a specific ride
const getMessages = async (req, res) => {
  const { rideId } = req.params;

  try {
    const messages = await Chat.find({ rideId }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getMessages };
