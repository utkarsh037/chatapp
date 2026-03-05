const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await new User({
      firstName,
      lastName,
      email,
      password: hashPassword
    }).save();

    res.status(201).send({
  message: "User registered successfully",
  user: {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email
  }
});

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = registerController;