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
  getAllComments,
  hideComment,
  unhideComment
} = require("../Controller/Comment_controller.js");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../Controller/Blog_controller.js");

const{requestPasswordReset,resetPassword} = require("../Controller/Auth_controller.js")
const {
  updateContact,
  getContacts,
  deleteContact,
} = require("../Controller/Contact_controller.js");
const {createReply,getReplies,hideReply,unhideReply} = require("../Controller/Reply_controller.js");
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
AdminRoute.put(
  "/updateBlog",
  authMiddleware,
  upload.single("image"),
  updateBlog
);
AdminRoute.delete("/deleteBlog/:id", authMiddleware, deleteBlog);

// reset password
AdminRoute.post("/requestPasswordReset",authMiddleware,requestPasswordReset)
AdminRoute.post("/reset-password",authMiddleware,resetPassword);
AdminRoute.post("/getleads",authMiddleware,getContacts)
AdminRoute.post("/getAllComments",authMiddleware,getAllComments);
AdminRoute.post("/deleteComment",authMiddleware,deleteComment)
AdminRoute.post("/replyToComment",authMiddleware,createReply)
AdminRoute.post("/getAllReplies",authMiddleware,getReplies)
AdminRoute.post("/hideReply",authMiddleware,hideReply)
AdminRoute.post("/unhideReply",authMiddleware,unhideReply)
AdminRoute.post("/hideComment",authMiddleware,hideComment)
AdminRoute.post("/unhideComment",authMiddleware,unhideComment)
module.exports = AdminRoute;
