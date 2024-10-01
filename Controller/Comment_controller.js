const commentModel = require("../Model/Comment_model.js");

// Create a comment
const createComment = async (req, res) => {
  const { blog_id, username, comment } = req.body;
  // console.log(req.body);

  if (!comment) {
    return res
      .status(400)
      .json({ status: false, message: "Comment cannot be empty" });
  }

  await commentModel.createComment({ blog_id, username, comment }, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to create comment" });
    }
    return res.status(200).json({ status: true, message: "Thanks For Commenting" }); 
  });
};

// Get comments for a blog
const getCommentByBlogId = async (req, res) => {
  const blogId = req.params.id;
  await commentModel.getCommentByBlogId(blogId, (err, comments) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Error fetching comments" });
    }
    // Function to convert replies string to an array of objects
    const convertRepliesStringToArray = (repliesString) => {
      return repliesString && repliesString.trim() !== ""
        ? repliesString.split(",").map((replys) => {
            const [reply_id, reply, reply_username, reply_created_at] = replys
              .split("|")
              .map((item) => item.trim());
            return {
              reply_id: Number(reply_id), // Convert reply_id to a number
              reply: reply,
              reply_username: reply_username,
              reply_created_at: reply_created_at,
            };
          })
        : [];
    };

    comments.forEach((comment) => {
      comment.replies = convertRepliesStringToArray(comment.replies);
    });

    return res.status(200).json({ message: "Get all Comments", comments });
  });
};

// Delete a comment
const deleteComment = async (req, res) => {
  // console.log(req.body);
  const { commentId, blog_id } = req.body;

  try {
    // Await the deletion operation from the model
    const result = await commentModel.deleteComment({ commentId, blog_id });

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete comment" });
  }
};

const getAllComments = async (req, res) => {
  const { role } = req.user;
  try {
    await commentModel.getAllComments(role, (err, comments) => {
      if (err) {
        console.error("Error fetching comments:", err);
        return res
          .status(500)
          .json({ status: false, message: "Error In Fetching Comments" });
      }
      const convertRepliesStringToArray = (repliesString) => {
        return repliesString && repliesString.trim() !== ""
          ? repliesString.split(",").map((replys) => {
              const [
                reply_id,
                reply,
                reply_username,
                reply_created_at,
                reply_is_hidden,
              ] = replys.split("|").map((item) => item.trim());
              return {
                reply_id: Number(reply_id), // Convert reply_id to a number
                reply: reply,
                reply_username: reply_username,
                reply_created_at: reply_created_at,
                reply_is_hidden: reply_is_hidden,
              };
            })
          : []; // Return an empty array if repliesString is null or empty
      };

      // Iterate through each comment and convert replies dynamically
      comments.forEach((comment) => {
        comment.replies = convertRepliesStringToArray(comment.replies);
      });

      return res
        .status(200)
        .json({ status: true, message: "Get All Comments", comments });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ status: false, message: "An unexpected error occurred" });
  }
};

const hideComment = async (req, res) => {
  const { comment_id, Is_hidden } = req.body;
  // console.log(req.body);

  // Validate input
  if (!comment_id) {
    return res
      .status(400)
      .json({ status: false, message: "Comment ID is required." });
  }

  try {
    const result = await commentModel.hideComment(comment_id, Is_hidden);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Comment not found or already hidden.",
      });
    }

   return res
      .status(200)
      .json({ status: true, message: "Comment hidden successfully." });
  } catch (error) {
    console.error("Error hiding comment:", error);
    return res
      .status(500)
      .json({ status: false, message: "Comment is already hidden" });
  }
};

const unhideComment = async (req, res) => {
  const { comment_id, Is_hidden } = req.body; // Use consistent casing for is_hidden
  // console.log(req.body);

  // Validate input
  if (!comment_id) {
    return res
      .status(400)
      .json({ status: false, message: "Comment ID is required." });
  }

  try {
    // Assuming unhideComment returns an object, not an array
    const result = await commentModel.unhideComment(comment_id, Is_hidden);

    // Check if the result has 'affectedRows' property
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Comment not found or already visible.",
      });
    }

    res.status(200).json({ message: "Comment unhidden successfully!" });
  } catch (error) {
    console.error("Error unhiding comment:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error unhiding comment" });
  }
};

module.exports = {
  createComment,
  deleteComment,
  getCommentByBlogId,
  getAllComments,
  hideComment,
  unhideComment,
};
