import Expense from "../models/Expense.js";
import AIInsight from "../models/AIInsight.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "../utils/ApiError.js";

import "../models/Category.js";

export const generateAIInsightService = async (userId) => {
    try {
        const since = new Date();
        since.setDate(since.getDate() - 60);

        const expenses = await Expense.find({ userId, expenseDate: { $gte: since } })
            .populate("categoryId", "name")
            .lean();

        if (expenses.length === 0) {
            throw new ApiError(400, "Add some expenses first so the AI has something to analyze");
        }

        const categoryTotals = {};
        expenses.forEach(exp => {
            const catName = typeof exp.categoryId === 'object' ? exp.categoryId?.name : "Other";
            categoryTotals[catName] = (categoryTotals[catName] || 0) + exp.amount;
        });

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const avgMonthly = (totalSpent / 2).toFixed(2);

        const prompt = `
      Analyze this user's 60-day spending data:
      Total: ₹${totalSpent.toFixed(2)}
      Avg Monthly: ₹${avgMonthly}
      Categories:
      ${Object.entries(categoryTotals).map(([k, v]) => `- ${k}: ₹${v}`).join("\n")}

      Return ONLY a JSON object:
      {
        "predictedMonthlySpending": number,
        "highestRiskCategory": "string",
        "riskExplanation": "string",
        "savingsRecommendation": "string",
        "budgetScore": number
      }
    `;

        console.log("🚀 Initializing Gemini 2.5 Flash Audit...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        try {
            const resultGen = await model.generateContent(prompt);
            const responseText = resultGen.response.text();

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Invalid format from AI");

            const parsed = JSON.parse(jsonMatch[0]);
            console.log("✅ Gemini 2.5 Flash Success.");

            const insight = await AIInsight.create({
                userId,
                ...parsed,
                generatedAt: new Date(),
            });
            return insight;

        } catch (err) {
            console.error("❌ Gemini Call Failed:");
            console.log(err);
            console.log("Message:", err.message);
            console.log("Response Data:", err.response?.data);

            throw new ApiError(500, `AI Audit Failed: ${err.message}`);
        }

    } catch (err) {
        console.error("Audit Service Error:", err.message);
        throw err instanceof ApiError ? err : new ApiError(500, err.message);
    }
};

export const getLatestInsightService = async (userId) => {
    try {
        const insight = await AIInsight.findOne({ userId }).sort({ generatedAt: -1 });
        if (!insight) throw new ApiError(404, "No analysis found.");
        return insight;
    } catch (err) {
        throw err;
    }
};
