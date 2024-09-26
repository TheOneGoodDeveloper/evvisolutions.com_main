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
    
    const query = `
    SELECT comments.id AS comment_id,
    comments.comment AS comment,
    comments.username AS comment_username,
    comments.created_at AS comment_created_at,
    (
        SELECT 
            GROUP_CONCAT(
                CONCAT_WS('| ', 
                    replies.id, 
                    replies.reply, 
                    replies.username,
                    replies.created_at  
                ) 
                ORDER BY replies.created_at
            ) 
        FROM 
            replies 
        WHERE 
            replies.comment_id = comments.id
             AND replies.is_hidden = FALSE
    ) AS replies
FROM 
    comments
WHERE 
    comments.blog_id = ?
    AND comments.is_hidden = FALSE  ;
`;
    connection.query(query, [blogId], callback);
  }
  static getCommentByBlogIdforAdmin(blogId, callback) {
    const query = `SELECT 
    comments.id AS comment_id,
    comments.comment AS comment,
    comments.username AS comment_username,
    comments.created_at AS comment_created_at,
    (
        SELECT 
            GROUP_CONCAT(
                CONCAT_WS(': ', 
                    replies.id, 
                    replies.reply, 
                    replies.username,
                    replies.created_at  
                ) 
                ORDER BY replies.created_at
            ) 
        FROM 
            replies 
        WHERE 
            replies.comment_id = comments.id
    ) AS replies
FROM 
    comments
WHERE 
    comments.blog_id = ?;
`;
    connection.query(query, [blogId], callback);
  }
  static async getAllComments(callback) {
    try {
              const query = `SELECT 
            comments.id AS comment_id,
            comments.comment AS comment,
            comments.username AS comment_username,
            comments.created_at AS comment_created_at,
            blogs.blog_title AS blog_title, 
            blogs.blog_author AS blog_author,
            (
                SELECT 
                    GROUP_CONCAT(
                        CONCAT_WS('| ', 
                            replies.id, 
                            replies.reply, 
                            replies.username,
                            replies.created_at,  
                            replies.is_hidden
                        ) 
                        ORDER BY replies.created_at
                    ) 
                FROM 
                    replies 
                WHERE 
                    replies.comment_id = comments.id
                    AND replies.is_hidden = FALSE
            ) AS replies
        FROM 
            comments
        JOIN 
            blogs 
        ON 
            comments.blog_id = blogs.id 
        WHERE 
            comments.is_hidden = FALSE 
        ORDER BY 
            comments.id ASC`;
      connection.query(query, callback);
    } catch (error) {
      console.error("Error fetching comments:", error);
      callback(error, null);
    }
  }

  static async deleteComment({ commentId, blog_id }) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM comments WHERE id = ? AND blog_id = ?";
      connection.query(query, [commentId, blog_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
  static async unhideComment(comment_id) {
    return new Promise((resolve, reject) => {
      const checkQuery = `SELECT is_hidden FROM comments WHERE id = ?`;
      connection.query(checkQuery, [comment_id], (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          return reject(new Error("Comment not found"));
        }

        const isHidden = result[0].is_hidden;
        if (!isHidden) {
          return reject(new Error("Comment is already visible"));
        }

        const updateQuery = `UPDATE comments SET is_hidden = FALSE WHERE id = ?`;
        connection.query(updateQuery, [comment_id], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  }
  static async hideComment(comment_id) {
    return new Promise((resolve, reject) => {
      const checkQuery = `SELECT is_hidden FROM comments WHERE id = ?`;
      connection.query(checkQuery, [comment_id], (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          return reject(new Error("Comment not found"));
        }

        const isHidden = result[0].is_hidden;
        if (isHidden) {
          return reject(new Error("Comment is already hidden"));
        }

        const updateQuery = `UPDATE comments SET is_hidden = TRUE WHERE id = ?`;
        connection.query(updateQuery, [comment_id], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  }
}

module.exports = commentModel;
