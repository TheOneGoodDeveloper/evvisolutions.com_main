const connection = require("../Model/db_Mysql");

class commentModel {
  static create(commentData, callback) {
    const query =
      "INSERT INTO comments (blog_id, comment, created_at) VALUES (?, ?, NOW())";
    connection.query(
      query,
      [commentData.blog_id, commentData.comment],
      callback
    );
  }

  static getByBlogId(blogId, callback) {
    const query =
      "SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at DESC";
    connection.query(query, [blogId], callback);
  }

  static delete(commentId, callback) {
    const query = "DELETE FROM comments WHERE id = ?";
    connection.query(query, [commentId], callback);
  }
}

module.exports = commentModel;
