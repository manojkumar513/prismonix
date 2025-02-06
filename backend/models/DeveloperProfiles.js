const mongoose = require("mongoose");
const DeveloperProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: { type: String, required: true },
  definesYou: { type: String, required: true },
  education: { type: String },
  skills: { type: String, required: true },
  preferredEmploymentType: { type: String, required: true },
  preferredWorkEnvironment: { type: String, required: true },
  experience: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DeveloperProfile", DeveloperProfileSchema);
