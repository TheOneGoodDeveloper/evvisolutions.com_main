const connection = require("../Model/db_Mysql");

class BlogModel {
  static async createBlog(title, content, image, author) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO blogs (blog_title, blog_body, blog_image, blog_author) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [title, content, image, author],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static async getAllBlogs() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM blogs";
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static async getBlogById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM blogs WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static async updateBlog(id, title, body, image, author) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE blogs SET blog_title = ?, blog_body = ?, blog_image = ?, blog_author = ? WHERE id = ?";
      connection.query(
        query,
        [title, body, image, author, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static async deleteBlog(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM blogs WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  static getLatestBlog(callback) {
    const query =' SELECT * FROM blogs ORDER BY blog_date DESC LIMIT 4';
    ;
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          // console.log(err);
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = BlogModel;
