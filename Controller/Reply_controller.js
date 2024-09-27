const replyModel = require("../Model/Reply_model");

const createReply = async (req, res) => {
  const { id, reply } = req.body;
  const username = req.body.username ? req.body.username : "author";
  console.log(req.body);

  // Validate input
  if (!id || !reply) {
    return res.status(400).json({
      message: "All fields are required: comment_id, username, reply.",
    });
  }

  try {
    const result = await replyModel.createReply(id, username, reply);
    res
      .status(201)
      .json({ message: "Reply created successfully!", replyId: result });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ message: "Error creating reply", error });
  }
};

const getReplies = async (req, res) => {
  const { comment_id } = req.body;

  // Validate input
  if (!comment_id) {
    return res.status(400).json({ message: "commentId is required." });
  }

  try {
    const replies = await replyModel.getRepliesByCommentId(comment_id);
    res.status(200).json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Error fetching replies", error });
  }
};

const hideReply = async (req, res) => {
  const { reply_id } = req.body;

  // Validate input
  if (!reply_id) {
    return res.status(400).json({ message: "Reply ID is required." });
  }

  try {
    const [result] = await replyModel.hideReply(reply_id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Reply not found or already hidden." });
    }

    res.status(200).json({ message: "Reply hidden successfully!" });
  } catch (error) {
    console.error("Error hiding reply:", error);
    res.status(500).json({ message: "Error hiding reply", error });
  }
};

const unhideReply = async (req, res) => {
  const { reply_id } = req.body;

  // Validate input
  if (!reply_id) {
    return res.status(400).json({ message: "Reply ID is required." });
  }

  try {
    const [result] = await replyModel.unhideReply(reply_id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Reply not found or already visible." });
    }

    res.status(200).json({ message: "Reply unhidden successfully!" });
  } catch (error) {
    console.error("Error unhiding reply:", error);
    res.status(500).json({ message: "Error unhiding reply", error });
  }
};

module.exports = { createReply, getReplies, hideReply, unhideReply };
