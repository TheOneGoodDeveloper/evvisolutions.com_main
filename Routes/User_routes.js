// node_modules
const express = require("express");
const UserRoute = express.Router();

//Controllers
const {
  contactSubmit,
  updateContact,
  getContacts,
  deleteContact,
} = require("../Controller/Contact_controller.js");
const {
  getAllBlogs,
  latestBlogs,
  getBlogById,
} = require("../Controller/Blog_controller.js");
const {
  createComment,
  deleteComment,
  getCommentByBlogId,
} = require("../Controller/Comment_controller.js");
const {
  requestPasswordReset,
  resetPassword,
} = require("../Controller/Auth_controller.js");

const {createReply,getReplies} = require("../Controller/Reply_controller.js")
// user Api's
UserRoute.post("/contact", contactSubmit);
UserRoute.post("/getAllBlogs", getAllBlogs);
UserRoute.get("/getBlogById/:id", getBlogById);
UserRoute.get("/latestBlogs", latestBlogs);
UserRoute.post("/createComments", createComment);
UserRoute.get("/getCommentByBlogId/:id", getCommentByBlogId);
UserRoute.post("/auth/requestPasswordReset", requestPasswordReset);
UserRoute.post("/auth/resetPassword/:token", resetPassword);
UserRoute.post("/replyToComment",createReply)
UserRoute.post ("/getReplies",getReplies);
module.exports = UserRoute;
