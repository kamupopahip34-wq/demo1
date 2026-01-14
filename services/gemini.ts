
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client correctly using the mandatory environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  // AI-generated task instructions using Gemini 3 Flash for efficiency
  generateTaskDetails: async (title: string, reward: number) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create clear instructions for a micro-task titled "${title}" which rewards ${reward} currency. Format as a clean list.`,
      });
      // Correctly access the .text property (not a method) to get the response string
      return response.text || "No instructions generated.";
    } catch (error) {
      console.error("Gemini service error:", error);
      return "Default instructions: Follow all steps carefully and upload proof.";
    }
  },

  // Mock Screenshot Fraud Check
  analyzeProofScreenshot: async (screenshotData: string, instructions: string) => {
    // In a real application, we would use gemini-2.5-flash-image for visual proof analysis.
    // For this simulation, we return a mock response.
    return {
      isLikelyFraud: Math.random() < 0.1,
      confidence: 0.85,
      notes: "Screenshot matches task context based on automated analysis."
    };
  }
};
