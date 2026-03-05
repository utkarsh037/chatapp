const Message = require("../models/messageModel");

const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { getMessages };