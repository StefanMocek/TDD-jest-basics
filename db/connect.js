require('dotenv').config();
const mongoose = require("mongoose")

async function connect() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {useNewUrlParser: true,}
    );
  } catch (error) {
    console.log("failed to connect to mongoDB");
    console.error(error);
  }
};

module.exports = {connect};