import { GoogleGenAI, Chat } from "@google/genai";
import { FinancialData, Message } from "../types";

const API_KEY = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Initialize Gemini Client
export const initializeGemini = (data: FinancialData) => {
  if (!API_KEY) {
    console.error("API Key missing");
    return;
  }

  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Create system instruction based on user data
    const systemInstruction = `
      You are Bob, a world-class senior financial advisor for the company "${data.companyName}" in the ${data.industry} industry.
      
      Current Financial Snapshot:
      - Annual Revenue: $${data.annualRevenue.toLocaleString()}
      - Monthly Expenses: $${data.monthlyExpenses.toLocaleString()}
      - Health Score: ${data.healthScore}/100
      
      Your personality: Professional, encouraging, sharp, and data-driven.
      Your goal: Provide actionable advice to improve their health score, cut costs, and increase revenue.
      
      If the user asks about their specific data, refer to the snapshot above.
      Keep responses concise and helpful. formatting with markdown is encouraged.
    `;

    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
};

export const sendMessageToBob = async (text: string): Promise<string> => {
  if (!chatSession) {
    return "Bob is currently offline. Please check your API configuration or refresh the page.";
  }

  try {
    const result = await chatSession.sendMessage({ message: text });
    return result.text || "I'm reviewing your file, but I couldn't generate a response just now.";
  } catch (error) {
    console.error("Error sending message:", error);
    return "I encountered an issue processing your financial query. Please try again.";
  }
};