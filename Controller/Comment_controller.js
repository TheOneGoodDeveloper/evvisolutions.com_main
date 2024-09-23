const commentModel = require("../Model/Comment_model.js");

// Create a comment
const createComment = async (req, res) => {
  const { blog_id, comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  await commentModel.createComment({ blog_id,  comment }, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to create comment" });
    }
    res.status(200).json({ message: "Thanks For Commenting" }); // Redirect to the blog page
  });
};

// Get comments for a blog
const getCommentByBlogId = async (req, res) => {
  const blogId = req.params.blogId;
  await commentModel.getCommentByBlogId(blogId, (err, comments) => {
    if (err) {
      return res
        .status(500)
        .json({ status: true, message: "Error fetching comments" });
    }
    res.status(200).json({ message: "Get all Comments", comments });
  });
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentId, blogId } = req.params;

  await commentModel.deleteComment({ commentId, blogId }, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete comment" });
    }
    res.status(200).json({ message: "comment deleted Successfully" });
  });
};

module.exports = { createComment, deleteComment, getCommentByBlogId };
