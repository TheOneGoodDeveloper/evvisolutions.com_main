const { SendEmail } = require("../MailSender/mailSender.js");

const connection = require("../Model/db_Mysql");
const contactModel = require("../Model/Contact_model.js");

// Create a new contact
const contactSubmit = async (req, res) => {
  const { name, phone, email, subject, details } = req.body;

  if (!name || !phone || !email || !subject || !details) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const contactData = [name, phone, email, subject, details || "no"];

  contactModel.createContact(contactData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error creating contact", err });
    }
    SendEmail(req.body)
      .then(() => {
        res.status(200).json({
          message: "Contact submitted successfully and email sent",
        });
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        res.status(500).json({
          error: "Contact submitted but failed to send email",
        });
      });
  });
};

// Get all contacts or a specific contact
const getContacts = async (req, res) => {
  const { id } = req.params;

  await contactModel.getContacts(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving contacts" });
    }

    return res.status(200).json(results);
  });
};

// Update an existing contact
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, subject, details } = req.body;

  if (!name || !phone || !email || !subject || !details) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const contactData = [name, phone, email, subject, details];

  await contactModel.updateContact(id, contactData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error updating contact" });
    }

    return res.status(200).json({ message: "Contact updated successfully" });
  });
};
// Delete a contact
const deleteContact = async (req, res) => {
  const { id } = req.params;

  await contactModel.deleteContact(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting contact" });
    }

    return res.status(200).json({ message: "Contact deleted successfully" });
  });
};
module.exports = { contactSubmit, updateContact, getContacts, deleteContact };
