const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const BlogModel = require("../Model/Blog_model.js");
const upload = require("../Middleware/multer_config.js");

// Configure multer for image upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/blog_images"); // Define your uploads folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
//   fileFilter: function (req, file, cb) {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimeType = fileTypes.test(file.mimetype);

//     if (extname && mimeType) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Images only! (jpeg, jpg, png)"));
//     }
//   },
// });

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
  // upload(req, res, async function (err) {
  //   if (err instanceof multer.MulterError || err) {
  //     return res.status(400).json({ status: false, message: err.message });
  //   }

    try {
      const { title, content, author } = req.body;
      const result = await BlogModel.createBlog(
        title,
        content,
        req.file.filename,
        author
      );
      console.log("Blog created successfully");
      res
        .status(201)
        .json({ status: true, message: "Blog created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal server error", error });
    }
  };
// };

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.getAllBlogs();
    res.status(200).json({ status: true, blogs });
  } catch (error) {
    res
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
    res.status(200).json({ status: true, blog: blog[0] });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
  // upload(req, res, async function (err) {
  //   if (err instanceof multer.MulterError || err) {
  //     return res.status(400).json({ status: false, message: err.message });
  //   }
    try {
      const { id, title, body, author } = req.body;
      const newImage = req.file ? req.file.filename : null;

      // Fetch the old blog to get the current image
      const blog = await BlogModel.getBlogById(id);
      if (blog.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Blog not found" });
      }

      // Delete the old image if a new image is uploaded
      if (newImage && blog[0].image) {
        const oldImagePath = path.join(__dirname, "../blog_images", blog[0].image);
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
        return res
          .status(404)
          .json({ status: false, message: "Blog not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Blog updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal server error", error });
    }
  // });
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  // try {
    const id = req.params.id;
    const blog = await BlogModel.getBlogById(id);
    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    // Delete the blog image from the folder
    if (blog[0].image) {
      const imagePath = path.join(__dirname, "../blog_images", blog[0].image);
      deleteOldImage(imagePath);
    }

    const result = await BlogModel.deleteBlog(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Blog deleted successfully" });
  // } catch (error) {
  //   res
  //     .status(500)
  //     .json({ status: false, message: "Internal server error", error });
  // }
};


module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
