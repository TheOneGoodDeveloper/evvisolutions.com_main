const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const connection = require("../Model/db_Mysql.js"); // Your MySQL connection
const { promisify } = require("util");
const { sendMailforResetPassword } = require("../MailSender/mailSender.js");

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  // Check if admin exists
  const [admin] = await promisify(connection.query).bind(connection)(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!admin) {
    return res.status(404).send("Admin with this email does not exist.");
  }

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // Token valid for 1 hour

  // Save token and expiration in the database
  await promisify(connection.query).bind(connection)(
    "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [token, expires, email]
  );

  // Send reset email
  sendMailforResetPassword(token)
    .then(() => {
      res
        .status(200)
        .json({ message: "Password Reset initalized and email sent" });
    })
    .catch((err) => {
      console.error("Error sending rset password request email:", err);
      res
        .status(500)
        .json({
          error: "password Reset request initalized but failed to send email",
        });
    });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Find the user by the reset token and check if token has expired
  const [user] = await promisify(db.query).bind(db)(
    "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?",
    [token, new Date()]
  );

  if (!user) {
    return res
      .status(400)
      .send("Password reset token is invalid or has expired.");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token and expiration
  await promisify(db.query).bind(db)(
    "UPDATE users SET encrypted_password = ?, password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?",
    [hashedPassword, newPassword, user.email]
  );

  res.send("Password has been successfully reset.");
};

module.exports = { requestPasswordReset, resetPassword };
