import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey === "your_openai_api_key_here") {
    console.log("⚠️  Warning: OPENAI_API_KEY is missing or using placeholder. AI features will not work.");
}

const openai = new OpenAI({
    apiKey: apiKey || "dummy_key_to_prevent_immediate_crash"
});

export default openai;
