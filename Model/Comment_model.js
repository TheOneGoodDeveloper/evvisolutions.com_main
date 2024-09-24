const connection = require("../Model/db_Mysql");

class commentModel {
  static createComment(commentData, callback) {
    const query =
      "INSERT INTO comments (blog_id, username,comment, created_at) VALUES (?, ?, ?, NOW())";
    connection.query(
      query,
      [commentData.blog_id, commentData.username, commentData.comment],
      callback
    );
  }

  static getCommentByBlogId(blogId, callback) {
    const query =
      "SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at DESC";
    connection.query(query, [blogId], callback);
  }
  static async getAllComments(callback) {
    try {
      const query =
        "SELECT comments.*, blogs.blog_title AS blog_title, blogs.blog_author AS blog_author FROM comments JOIN blogs ON comments.blog_id = blogs.id ORDER BY comments.id ASC";
      connection.query(query, callback);
    } catch (error) {
      console.error("Error fetching comments:", error);
      callback(error, null);
    }
  }

  static async deleteComment({ commentId, blog_id }){
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM comments WHERE id = ? AND blog_id = ?';
      connection.query(query, [commentId, blog_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = commentModel;
