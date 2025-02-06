const mongoose = require("mongoose");

const InvestorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    location: {type: String, required: true},
    education: {type: String, required: true},
    investmentFocus: {type: String, required: true},
    capitalRange: {type: String, required: true},
    investmentStage: {type: String, required: true},
    portfolioCompanies: {type: String, required: true},
    portfolioUrl: {type: String, required: true},
    termsAccepted: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InvestorProfile", InvestorProfileSchema);
