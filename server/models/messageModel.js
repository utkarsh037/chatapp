const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    default: ""
  },
  receiver: {
    type: String,
    default: null   // ← no longer required
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "global"  // "global" or "direct"
  }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;