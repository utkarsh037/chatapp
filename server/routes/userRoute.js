const express = require("express");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/profile", authMiddleware, (req, res) => {
  res.send({
    message: "Protected profile data",
    user: req.user
  });
});

module.exports = router;