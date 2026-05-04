import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PRIMARY_MODEL = "gemini-1.5-flash";

export async function generateAIResponse(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const result = await model.generateContent(prompt);
        return result;
    } catch (error) {
        console.error("Gemini API failed, falling back to Ollama:", error.message);
        return await ollamaFallback(prompt);
    }
}

async function ollamaFallback(prompt) {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";

    try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3", // configurable fallback model
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Format the response to mimic Gemini's structure so upstream code doesn't break
        return {
            response: {
                text: () => data.response,
                candidates: [
                    {
                        content: {
                            parts: [{ text: data.response }],
                        },
                    },
                ],
            },
        };
    } catch (err) {
        console.error("Ollama fallback also failed:", err.message);
        throw new Error("Both primary AI and fallback AI failed. " + err.message);
    }
}

/** Robust JSON Generative Pipeline with Automatic Error Retries */
export async function generateAIJSON(prompt, retries = 2) {
    let attempt = 0;
    let lastError = null;
    let currentPrompt = prompt;

    while (attempt <= retries) {
        try {
            const result = await generateAIResponse(currentPrompt);
            const text = result.response?.text
                ? result.response.text()
                : (result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "");

            if (!text || text.length < 10) {
                throw new Error("Empty AI response");
            }

            // Clean potential markdown blocks
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").replace(/```\n?/g, "").trim();

            let parsed;
            try {
                parsed = JSON.parse(cleanedText);
            } catch (e) {
                const match = cleanedText.match(/\{[\s\S]*\}/);
                if (match) {
                    parsed = JSON.parse(match[0]);
                } else {
                    throw new Error("Invalid JSON structure from AI");
                }
            }

            return parsed;
        } catch (error) {
            attempt++;
            lastError = error;
            console.warn(`JSON parsing failed on attempt ${attempt}. Retrying...`);
            // Update prompt to heavily mandate strict JSON for the retry
            currentPrompt = `${prompt}\n\nCRITICAL SYSTEM INSTRUCTION: YOUR PREVIOUS RESPONSE WAS INVALID JSON. YOU MUST RETURN **ONLY** STRICTLY VALID, MINIFIED JSON. NO MARKDOWN, NO CONVERSATION, NO OTHER TEXT.`;
        }
    }

    console.error("Failed to generate robust AI JSON after retries:", lastError);
    throw new Error("AI failed to return valid JSON format");
}
