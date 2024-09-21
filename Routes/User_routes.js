// node_modules
const express = require("express");
const UserRoute = express.Router();

//Controllers
const contactSubmit = require("../Controller/Contact_controller.js");
const { getAllBlogs,latestBlogs,getBlogById } = require("../Controller/Blog_controller.js");
const {
  createComment,
  deleteComment,
  getCommentByBlogId,
} = require("../Controller/Comment_controller.js");

// user Api's
UserRoute.post("/contact", contactSubmit);
UserRoute.post("/getAllBlogs", getAllBlogs);
UserRoute.get("/getBlogById/:id",getBlogById)
UserRoute.get("/latestBlogs",latestBlogs);
UserRoute.post("/createComments", createComment);
UserRoute.get("/getCommentByBlogId", getCommentByBlogId);

module.exports = UserRoute;
