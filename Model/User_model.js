const connection = require("../Model/db_Mysql.js"); // MySQL connection
const { promisify } = require("util");

class userModel {
  // Get user by email
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [result] = await promisify(connection.query).bind(connection)(query, [
      email,
    ]);
    return result;
  }

  // Update reset token and expiry
  static async updateResetToken(email, token, expires) {
    const query = `
      UPDATE users 
      SET reset_password_token = ?, reset_password_expires = ? 
      WHERE email = ?
    `;
    await promisify(connection.query).bind(connection)(query, [
      token,
      expires,
      email,
    ]);
  }

  // Find user by reset token and check if token is still valid
  static async findByResetToken(token) {
    const query = `
      SELECT * FROM users 
      WHERE reset_password_token = ? 
      AND reset_password_expires > ?
    `;
    const [result] = await promisify(connection.query).bind(connection)(query, [
      token,
      new Date(),
    ]);
    return result;
  }

  // Update user's password and clear the reset token
  static async updatePassword(email, hashedPassword, newPassword) {
    const query = `
      UPDATE users 
      SET encrypted_password = ?,password = ?, reset_password_token = NULL, reset_password_expires = NULL 
      WHERE email = ?
    `;
    await promisify(connection.query).bind(connection)(query, [
      hashedPassword,
      newPassword,
      email,
    ]);
  }
  static async passwordResetlog(email, token, expires) {
    const query =
      "INSERT INTO password_reset_history (email, token, expired_at) VALUES (?, ?, ?)";
    const params = [email, token, expires];
    return connection.query(query, params);
  }
}

module.exports = userModel;
