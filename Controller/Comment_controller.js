const commentModel = require("../Model/Comment_model.js");

// Create a comment
const createComment = async (req, res) => {
  const { blog_id, username, comment } = req.body;
  console.log(req.body);

  if (!comment) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  await commentModel.createComment({ blog_id, username, comment }, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to create comment" });
    }
    res.status(200).json({ message: "Thanks For Commenting" }); // Redirect to the blog page
  });
};

// Get comments for a blog
const getCommentByBlogId = async (req, res) => {
  const blogId = req.params.id;
  const result = await commentModel.getCommentByBlogId(
    blogId,
    (err, comments) => {
      if (err) {
        return res
          .status(500)
          .json({ status: true, message: "Error fetching comments" });
      }
      // Function to convert replies string to an array of objects
      const convertRepliesStringToArray = (repliesString) => {
        return repliesString && repliesString.trim() !== ""
          ? repliesString.split(",").map((replys) => {
              const [reply_id, reply, reply_username, reply_created_at] = replys
                .split(":")
                .map((item) => item.trim());
              return {
                reply_id: Number(reply_id), // Convert reply_id to a number
                reply: reply,
                reply_username: reply_username,
                reply_created_at: reply_created_at,
              };
            })
          : []; // Return an empty array if repliesString is null or empty
      };

      // Iterate through each comment and convert replies dynamically
      comments.forEach((comment) => {
        comment.replies = convertRepliesStringToArray(comment.replies);
      });

      res.status(200).json({ message: "Get all Comments", comments });
    }
  );
};

// Delete a comment
const deleteComment = async (req, res) => {
  console.log(req.body);
  const { commentId, blog_id } = req.body;

  try {
    // Await the deletion operation from the model
    const result = await commentModel.deleteComment({ commentId, blog_id });

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

const getAllComments = async (req, res) => {
  try {
    await commentModel.getAllComments((err, comments) => {
      if (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({
          message: "Error In Fetching Comments",
        });
      }

      return res.status(200).json({
        message: "Get All Comments",
        comments,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

module.exports = {
  createComment,
  deleteComment,
  getCommentByBlogId,
  getAllComments,
};
