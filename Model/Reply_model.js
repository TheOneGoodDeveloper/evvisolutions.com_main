const connection = require("./db_Mysql.js");
class replyModel {
  static async getRepliesByCommentId(commentId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM replies WHERE comment_id = ?",
        [commentId],
        (error, results) => {
          if (error) {
            console.log(error); // Corrected the variable name to error
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static async createReply(commentId, username, reply) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO replies (comment_id, username, reply, created_at) VALUES (?, ?, ?, NOW())",
        [commentId, username, reply],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static async hideReply(reply_id, hide_status) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE replies SET is_hidden = ? WHERE id = ?`;
      connection.query(query, [hide_status, reply_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static async unhideReply(reply_id, hide_status) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE replies SET is_hidden = ? WHERE id = ?`;
      connection.query(query, [hide_status, reply_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static async getReplyById (reply_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM replies WHERE id = ?';
      connection.query(query, [reply_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0]); // Returning the first result if reply found
      });
    });
  }
}

module.exports = replyModel;
