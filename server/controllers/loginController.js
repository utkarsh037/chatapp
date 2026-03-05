const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const loginController = async (req, res) => {
  try {

    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // generate token
    const token = user.generateAuthToken();

    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = loginController;