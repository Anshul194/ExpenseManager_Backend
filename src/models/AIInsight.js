import mongoose from "mongoose";
const aiInsightSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    predictedMonthlySpending: Number,

    highestRiskCategory: String,

    riskExplanation: String,

    savingsRecommendation: String,

    budgetScore: {
        type: Number,
        min: 0,
        max: 100
    },



    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model("AIInsight", aiInsightSchema);
