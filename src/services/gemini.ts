import { GoogleGenAI, Chat } from "@google/genai";
import { FinancialData } from "../types";

// Use Vite env var (must be prefixed with VITE_ in your .env)
const API_KEY = import.meta.env.VITE_API_KEY || '';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Initialize Gemini Client
export const initializeGemini = (data: FinancialData) => {
  if (!API_KEY) {
    console.error("API Key missing - AI features disabled");
    return;
  }

  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // We keep the system instruction generic so it doesn't conflict with dynamic data
    const systemInstruction = `
      You are Bob, a friendly and straightforward financial advisor for the business "${data.companyName}" (${data.industry} industry).
      
      Your Role:
      1. Trust the "CURRENT LIVE DASHBOARD DATA" provided in each user message above all else.
      2. Be concise and encouraging.
      3. Avoid complex financial jargon. Explain things simply.
      4. If the user asks for advice, focus on 3 levers: increasing prices, cutting unnecessary costs, or finding new customers.
      5. Keep responses short (under 3 sentences ideally).
      
      Always format your response nicely with Markdown.
    `;

    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, // Lower temperature for more factual adherence
      },
    });

  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
};

export const resetChat = () => {
  // Helper to clear context if needed, though we primarily rely on prompt injection
  if (ai) {
    // We can't easily "clear" a chat object in the SDK without creating a new one, 
    // but usually prompt injection is sufficient. 
    // For now, we leave this as a placeholder or re-init if strictly needed.
  }
};

export const sendMessageToBob = async (
  text: string,
  context?: {
    annualRevenue: number;
    monthlyExpenses: number;
    cashFlow: number;
    healthScore: number;
    netIncome: number;
  },
  isSimulating: boolean = false
): Promise<string> => {
  if (!chatSession) {
    return "I'm not fully set up yet. Please complete the onboarding so I can see your financial data.";
  }

  let messageToSend = text;

  // If context is provided, prepend it to the user's message invisibly
  if (context) {
    const contextString = `
*** SYSTEM INSTRUCTION: CURRENT LIVE DASHBOARD DATA ***
The user is looking at the following numbers right now. 
IGNORE any previous numbers mentioned in this chat history. 
Use ONLY these numbers for your answer.

Status: ${isSimulating ? 'SIMULATION ACTIVE (Hypothetical Scenerio)' : 'ACTUAL REAL-TIME DATA'}
- Annual Revenue: $${Math.round(context.annualRevenue).toLocaleString()}
- Monthly Expenses: $${Math.round(context.monthlyExpenses).toLocaleString()}
- Annual Net Income: $${Math.round(context.netIncome).toLocaleString()}
- Monthly Cash Flow: $${Math.round(context.cashFlow).toLocaleString()}
- Health Score: ${context.healthScore}/100

(Do not recalculate these metrics manually. Assume these numbers are correct.)
*******************************************************
`;
    messageToSend = `${contextString}\n\nUser Question: ${text}`;
  }

  try {
    const result = await chatSession.sendMessage({ message: messageToSend });
    return result.text || "I'm reviewing the numbers, but I couldn't come up with an answer right now.";
  } catch (error) {
    console.error("Error sending message:", error);
    return "I'm having a little trouble connecting to my brain right now. Please try asking again in a moment.";
  }
};