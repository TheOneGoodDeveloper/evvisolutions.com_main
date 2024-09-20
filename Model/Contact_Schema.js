const mongoose = require('mongoose');

// Define the schema for the contact form
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  is_deleted:{
    type:String,
  }
});

// Create the model from the schema and export it
const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
