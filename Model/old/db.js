const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env["MONGODB_URI"]);
    console.log("Database Created Successfully");
  } catch (error) {
    console.log("Error While Creating Database", error);
  }
};

module.exports = connectDatabase;