import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userName: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Post = mongoose.model('Post', postSchema);