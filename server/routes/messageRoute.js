const express = require("express");
const { getMessages } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/history", authMiddleware, getMessages);

module.exports = router;