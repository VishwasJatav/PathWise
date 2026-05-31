import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

async function main() {
    console.log("Testing AI generation...");
    try {
        const { generateAIResponse } = await import("./lib/ai/provider.js");
        const res = await generateAIResponse("Hello, what is your name?");
        console.log("AI Response:", res.response.text());
    } catch (err) {
        console.error("AI Error:", err);
    }
}

main();
