import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
    console.log("⚠️  Warning: ANTHROPIC_API_KEY is missing. Claude features will not work.");
}

const anthropic = new Anthropic({
    apiKey: apiKey || "dummy_key",
});

export default anthropic;
