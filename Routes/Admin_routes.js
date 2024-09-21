// Node_modules
const express = require("express");
const AdminRoute = express.Router();

// image upload using multer
const upload = require("../Middleware/multer_config.js");

// Controllers
const {
  authMiddleware,
  adminLogin,
} = require("../Controller/Admin_controller.js");
const {
  createComment,
  deleteComment,
  getCommentByBlogId,
} = require("../Controller/Comment_controller.js");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../Controller/Blog_controller.js");

// user Api's
AdminRoute.post("/login", adminLogin);
AdminRoute.post(
  "/createBlog",
  authMiddleware,
  upload.single("image"),
  createBlog
); // Single file upload with field name 'image'
AdminRoute.get("/getAllBlogs", authMiddleware, getAllBlogs);
AdminRoute.get("/:id", authMiddleware, getBlogById);
AdminRoute.post(
  "/updateBlog",
  authMiddleware,
  upload.single("image"),
  updateBlog
);
AdminRoute.delete("/deleteBlog/:id", authMiddleware, deleteBlog);

module.exports = AdminRoute;
