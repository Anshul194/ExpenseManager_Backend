import { generateAIInsightService, getLatestInsightService } from "../services/ai.service.js";

export const generateInsights = async (req, res) => {
    try {
        const insight = await generateAIInsightService(req.user._id);

        res.status(200).json({
            success: true, message: "Insights generated", data: { insight },
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Something went wrong with AI insights",
        });
    }
};

export const getLatestInsight = async (req, res) => {
    try {
        const insight = await getLatestInsightService(req.user._id);
        res.json({ success: true, data: { insight } });
    } catch (err) {
        res.status(err.statusCode || 404).json({ success: false, message: err.message });
    }
};
