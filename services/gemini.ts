
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const geminiService = {
  // AI-generated task instructions
  generateTaskDetails: async (title: string, reward: number) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create clear instructions for a micro-task titled "${title}" which rewards ${reward} currency. Format as a clean list.`,
      });
      return response.text || "No instructions generated.";
    } catch (error) {
      console.error(error);
      return "Default instructions: Follow all steps carefully and upload proof.";
    }
  },

  // Mock Screenshot Fraud Check
  analyzeProofScreenshot: async (screenshotData: string, instructions: string) => {
    // In a real app, we'd send the base64 to Gemini Pro Vision.
    // For this simulation, we return a generic confidence score.
    return {
      isLikelyFraud: Math.random() < 0.1,
      confidence: 0.85,
      notes: "Screenshot matches task context based on automated analysis."
    };
  }
};
