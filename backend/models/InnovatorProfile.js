const mongoose = require("mongoose");

const InnovatorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    location: { type: String, required:true },
    education: { type: String, required:true },
    currentRole: { type: String, required:true },
    skills: { type: String, required:true },
    industryFocus: { type: String, required:true },
    expertise: { type: String, required:true },
    innovationCategories: { type: String, required:true },
    collaborationType: { type: String, required:true },
    needs: { type: String, required:true },
    portfolioURL: { type: String, required:true },
    termsAccepted: { type: Boolean, required:true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InnovatorProfile", InnovatorProfileSchema);
