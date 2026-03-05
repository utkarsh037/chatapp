const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("DB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("DB CONNECTION FAILED");
    console.error(error);
  }
};