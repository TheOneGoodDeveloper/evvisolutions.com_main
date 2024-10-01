// Node_modules & In-built Functions
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

// Mail Sender
const { sendMailforResetPassword } = require("../MailSender/mailSender.js"); // Mail Sender

// model
const userModel = require("../Model/User_model.js");
const connection = require("../Model/db_Mysql.js");

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if admin exists using userModel
    const admin = await userModel.findByEmail(email);

    if (!admin) {
      return res
        .status(404)
        .json({ error: "Admin with this email does not exist." });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Run database update and send email in parallel using Promise.all
    await Promise.all([
      userModel.updateResetToken(email, token, expires),
      // Send reset email asynchronously
      sendMailforResetPassword(email,token),
      // Log password reset asynchronously
      connection
        .promise()
        .query(
          "INSERT INTO password_reset_history (email, token, expired_at) VALUES (?, ?, ?)",
          [email, token, expires]
        ),
    ]);

    return res
      .status(200)
      .json({ message: "Password reset initialized and email sent." });
  } catch (err) {
    console.error("Error during password reset request:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    // console.log(req.params);
    // console.log(req.body);
    // Find the user by the reset token and check if token has expired
    const user = await userModel.findByResetToken(token);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token and expiration
    await userModel.updatePassword(user.email, hashedPassword, newPassword);

    return res
      .status(200)
      .json({ message: "Password has been successfully reset." });
  } catch (err) {
    console.error("Error during password reset:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { requestPasswordReset, resetPassword };
