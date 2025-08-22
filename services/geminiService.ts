
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateCaptions = async (topic: string): Promise<string[]> => {
  if (!API_KEY) {
    // Simulate API call for environments without an API key
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      `This is a great simulated caption about ${topic}! #awesome`,
      `Exploring ${topic} today. What are your thoughts? #discussion`,
      `Here's a cool post about ${topic}. Enjoy! #simulated`,
    ];
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 diverse and engaging social media captions for a post about: "${topic}". The captions should be short, punchy, and include relevant hashtags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              description: "An array of 3 caption strings.",
              items: { type: Type.STRING }
            }
          }
        },
        temperature: 0.8,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result.captions && Array.isArray(result.captions)) {
        return result.captions;
    }
    
    throw new Error("Invalid response format from AI.");

  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error("Failed to generate captions. Please check your API key and try again.");
  }
};
