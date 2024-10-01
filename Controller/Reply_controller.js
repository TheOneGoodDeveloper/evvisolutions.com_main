const replyModel = require("../Model/Reply_model");

const createReply = async (req, res) => {
  const { id, reply } = req.body;
  const username = req.body.username ? req.body.username : "author";
  // console.log(req.body);

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
  const { reply_id, hide_status } = req.body;
  // console.log(req.body);

  // Validate input
  if (!reply_id) {
    return res.status(400).json({ message: "Reply ID is required." });
  }

  try {
    // Check if reply exists and its current hide status
    const existingReply = await replyModel.getReplyById(reply_id);
    if (!existingReply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    if (existingReply.is_hidden == hide_status) {
      return res.status(400).json({
        message: hide_status
          ? "Reply is already hidden."
          : "Reply is visible Already.",
      });
    }

    // Update hide status
    const result = await replyModel.hideReply(reply_id, hide_status);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Failed to update the reply status." });
    }

    return res.status(200).json({
      message: hide_status
        ? "Reply hidden successfully!"
        : "Reply already visible!",
    });
  } catch (error) {
    console.error("Error hiding reply:", error);
    return res.status(500).json({ message: "Error hiding reply" });
  }
};

const unhideReply = async (req, res) => {
  const { reply_id, hide_status } = req.body; // Removed hide_status since it's not needed for unhiding

  // console.log("Received reply_id:", reply_id, hide_status);

  // Validate input
  if (!reply_id || typeof reply_id !== "number") {
    return res.status(400).json({
      status: false,
      message: "Valid reply ID is required.",
    });
  }

  try {
    // Check if the reply exists and its current status
    const existingReplies = await replyModel.getReplyById(reply_id);

    if (existingReplies.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Reply not found.",
      });
    }

    const existingReply = existingReplies[0];
    if (!existingReplies.is_hidden) {
      return res.status(400).json({
        status: false,
        message: "Reply is already visible.",
      });
    }

    // Unhide the reply using the model
    const result = await replyModel.unhideReply(reply_id, hide_status);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Failed to unhide the reply.",
      });
    }

    // Send success response
    return res.status(200).json({
      status: true,
      message: "Reply unhidden successfully!",
    });
  } catch (error) {
    console.error("Error unhiding reply:", error);

    // Send error response
    return res.status(500).json({
      status: false,
      message: "An error occurred while un-hiding the reply.",
    });
  }
};

module.exports = { createReply, getReplies, hideReply, unhideReply };
