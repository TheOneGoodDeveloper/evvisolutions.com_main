const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const BlogModel = require("../Model/Blog_model.js");
const upload = require("../Middleware/multer_config.js");

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    }
  });
};

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const result = await BlogModel.createBlog(
      title,
      content,
      req.file.filename,
      author
    );
    console.log("Blog created successfully");
    return res
      .status(201)
      .json({ status: true, message: "Blog created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};
// };

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.getAllBlogs();
    return res.status(200).json({ status: true, blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// GET BLOG BY ID
const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await BlogModel.getBlogById(id);
    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }
    return res.status(200).json({ status: true, blog });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
  try {
    const { id, title, body, author } = req.body;
    const newImage = req.file ? req.file.filename :req.body.image ;
    // Fetch the old blog to get the current image
    const blog = await BlogModel.getBlogById(id);
    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    // console.log(blog);
    // Delete the old image if a new image is uploaded
    if (req.file && blog[0].blog_image) {
      // console.log("image");
      const oldImagePath = path.join(
        __dirname,
        "../blog_images/",
        blog[0].blog_image
      );
      // console.log(oldImagePath);
      deleteOldImage(oldImagePath);
    }

    const result = await BlogModel.updateBlog(
      id,
      title,
      body,
      newImage || blog[0].image,
      author
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await BlogModel.getBlogById(id);
    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    // Delete the blog image from the folder
    if (blog[0].blog_image) {
      const imagePath = path.join(
        __dirname,
        "../blog_images/",
        blog[0].blog_image
      );
      deleteOldImage(imagePath);
    }

    const result = await BlogModel.deleteBlog(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};
const latestBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.getLatestBlog();
    // console.log(blogs); // Adjusted to get the latest blog
    if (blogs.length === 0) {
      return res.status(404).json({ status: false, message: "No blogs found" });
    }
    return res.status(200).json({ status: true, blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  latestBlogs,
};
