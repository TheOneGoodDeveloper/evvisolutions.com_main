const connection = require("./db_Mysql.js");

class replyModel {
  static async getRepliesByCommentId(commentId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM replies WHERE comment_id = ?",
        [commentId],
        (error, results) => {
          if (error) {
            console.log(err);
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
  static async hideReply(reply_id) {
    const query = `UPDATE replies SET is_hidden = TRUE WHERE id = ?`;

    // Execute the query and return the result
    return connection.execute(query, [reply_id]);
  }

  static async unhideReply(reply_id) {
    const query = `UPDATE replies SET is_hidden =FALSE  WHERE id = ?`;

    // Execute the query and return the result
    return connection.execute(query, [reply_id]);
  }
}

module.exports = replyModel;
