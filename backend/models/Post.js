const mongoose = require("mongoose");

// Define the schema for the post
const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fs.files", // Reference to GridFS files collection
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the post model
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

module.exports = Post;
