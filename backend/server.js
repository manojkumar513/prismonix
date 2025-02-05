const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL in production
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Server error handling
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

