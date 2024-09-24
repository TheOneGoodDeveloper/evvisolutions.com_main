const replyModel = require("../Model/Reply_model");

const createReply = async (req, res) => {
  const { comment_id, reply } = req.body;
  const username = req.body.username ? req.body.username : "admin";

  // Validate input
  if (!comment_id || !reply) {
    return res.status(400).json({
      message: "All fields are required: comment_id, username, reply.",
    });
  }

  try {
    const result = await replyModel.createReply(comment_id, username, reply);
    res
      .status(201)
      .json({ message: "Reply created successfully!", replyId: result });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ message: "Error creating reply", error });
  }
};

const getReplies = async (req, res) => {
  const { commentId } = req.params;

  // Validate input
  if (!commentId) {
    return res.status(400).json({ message: "commentId is required." });
  }

  try {
    const replies = await replyModel.getRepliesByCommentId(commentId);
    res.status(200).json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Error fetching replies", error });
  }
}

module.exports = {createReply,getReplies}
