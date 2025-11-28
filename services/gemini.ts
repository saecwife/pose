import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

/**
 * Generates 9 creative photography pose descriptions for a model interacting with a given product.
 */
export const generatePoseDescriptions = async (productName: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create 9 distinct, creative, and professional fashion photography pose ideas for a human model interacting with the product: "${productName}". 
      
      Focus explicitly on the MODEL'S POSE (e.g., holding the product near face, leaning on it, dynamic movement, hands positioning).
      Include a mix of:
      1. Close-ups (Hands/Face interacting with product)
      2. Half-body shots (Lifestyle interaction)
      3. Full-body shots (Fashion editorial style)
      
      Keep descriptions concise (under 15 words) but visually descriptive regarding the human posture.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 9 photography pose descriptions for a model.",
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from Gemini");
    
    const parsed = JSON.parse(jsonText);
    return parsed.poses.slice(0, 9);
  } catch (error) {
    console.error("Error generating pose descriptions:", error);
    throw error;
  }
};

/**
 * Generates a sketch image for a specific pose description focusing on the model.
 */
export const generatePoseSketch = async (productName: string, poseDescription: string): Promise<string> => {
  try {
    // Strictly enforce human presence in the prompt
    const prompt = `Fashion illustration storyboard sketch. A HUMAN MODEL posing with the product "${productName}". 
    The specific pose is: ${poseDescription}. 
    
    CRITICAL INSTRUCTION: The image MUST contain a human figure (man or woman). Do not draw the product alone.
    
    Style: Quick black and white pencil sketch, loose lines, fashion concept art, white background. 
    Focus on the body language and how the hands/body interact with the item.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        // No specific image config needed for basic generation
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating sketch:", error);
    throw error;
  }
};
