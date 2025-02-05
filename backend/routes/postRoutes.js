const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket, ObjectId } = mongoose.mongo;
const jwt = require("jsonwebtoken");
const cors = require("cors");
const router = express.Router();
const Post = require("../models/Post");

const conn = mongoose.connection;
let bucket;

// Initialize GridFSBucket once the MongoDB connection is open
conn.once("open", () => {
  bucket = new GridFSBucket(conn.db, {
    bucketName: "fs",
  });
  console.log("GridFS Bucket initialized.");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to extract userId from the token and log it
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token Payload:", decoded);

    // Extract the user ID correctly based on token payload
    req.userId = decoded.id || decoded._id;
    console.log(`Authenticated userId: ${req.userId}`);

    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



router.use(cors());

// Route to handle post creation
router.post("/create", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.userId;

    let fileId = null;
    let fileType = null;

    if (req.file) {
      fileId = new ObjectId();
      const uploadStream = bucket.openUploadStreamWithId(fileId, req.file.originalname, {
        contentType: req.file.mimetype,
      });

      uploadStream.end(req.file.buffer);

      fileType = req.file.mimetype;
      uploadStream.on("error", (err) => {
        console.error("Error during file upload", err);
        return res.status(500).json({ message: "Error uploading file" });
      });
    }

    const newPost = new Post({
      text,
      user: userId,
      file: fileId,
      contentType: fileType,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post", err);
    res.status(500).json({ message: "Error creating post" });
  }
});

// Route to retrieve the uploaded file by ID
router.get("/file/:fileId", async (req, res) => {
  try {
    console.log("Received file request for fileId:", req.params.fileId);

    const fileId = new ObjectId(req.params.fileId);
    console.log("Converted fileId to ObjectId:", fileId);

    const fileCursor = bucket.find({ _id: fileId });
    console.log("File cursor created:", fileCursor);

    const files = await fileCursor.toArray();
    console.log("Files fetched from database:", files);

    if (!files || files.length === 0) {
      console.log("File not found");
      return res.status(404).json({ message: "File not found" });
    }

    console.log("Setting content type to:", files[0].contentType);
    res.set("Content-Type", files[0].contentType);

    const downloadStream = bucket.openDownloadStream(fileId);
    console.log("Opened download stream for fileId:", fileId);

    downloadStream.pipe(res);
    console.log("Streaming file to response");
  } catch (err) {
    console.error("Error retrieving file", err);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

// Route to fetch all posts
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all posts");

    const posts = await Post.find()
      .populate("user", "firstName lastName")
      .exec();
    console.log("Posts fetched:", posts);

    const postsWithFileDetails = await Promise.all(
      posts.map(async (post) => {
        const postObj = post.toObject();
        console.log("Processing post:", postObj);

        if (post.file) {
          postObj.fileUrl = `${req.protocol}://${req.get("host")}/api/posts/file/${post.file}`;
          console.log("Generated fileUrl:", postObj.fileUrl);

          const file = await bucket.find({ _id: post.file }).toArray();
          console.log("File fetched from database for post:", file);

          if (file && file.length > 0) {
            postObj.fileType = file[0].contentType;
            console.log("File content type:", postObj.fileType);
          }
        }
        return postObj;
      })
    );

    console.log("Posts with file details:", postsWithFileDetails);
    res.json(postsWithFileDetails);
  } catch (err) {
    console.error("Error fetching posts", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to like a post
router.patch("/like/:postId", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.userId;

    if (post.likes && post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    post.likes = post.likes || [];
    post.likes.push(userId);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error liking post", err);
    res.status(500).json({ message: "Error liking post" });
  }
});

// Route to unlike a post
router.patch("/unlike/:postId", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.userId;

    if (!post.likes || !post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this post yet" });
    }

    post.likes = post.likes.filter((like) => like.toString() !== userId.toString());

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error unliking post", err);
    res.status(500).json({ message: "Error unliking post" });
  }
});

module.exports = router;
