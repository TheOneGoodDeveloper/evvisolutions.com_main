const SendEmail = require("../MailSender/mailSender.js");

const connection = require("../Model/db_Mysql");

const contactSubmit = async (req, res) => {
  const { name, phone, email, subject, details } = req.body;

  // Validate input
  if (!name || !phone || !email || !subject || !details) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // SQL query to insert data into the contacts table
  const query = `
    INSERT INTO contacts (name, phone, email, subject, details)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Execute the query
  connection.query(
    query,
    [name, phone, email, subject, details || "no"],
    (err, results) => {
      SendEmail(req.body)
        .then(() => {
          res
            .status(200)
            .json({ message: "Contact submitted successfully and email sent" });
        })
        .catch((err) => {
          console.error("Error sending email:", err);
          res
            .status(500)
            .json({ error: "Contact submitted but failed to send email" });
        });
    }
  );
};

module.exports = contactSubmit;
