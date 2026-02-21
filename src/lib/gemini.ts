import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Gemini API Key is missing. Check your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const getGeminiPro = () => genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
export const getNanoBanana = () => genAI.getGenerativeModel({ model: "nano-banana-pro-preview" });
export const getGeminiFlash = () => genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export { genAI };
