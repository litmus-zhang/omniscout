
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async searchProviders(query: string, lat?: number, lng?: number) {
    // Create fresh instance to pick up injected API key
    const locationPart = lat && lng ? ` at coordinates (${lat}, ${lng})` : '';
    
    // Maps grounding is only supported in Gemini 2.5 series models.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find high-quality local service providers for: "${query}"${locationPart}. Provide a detailed analysis of their trust index and verify their claims using your tools. List the best ones clearly with their strengths.`,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
             latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
          }
        }
      }
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links = groundingChunks.map((chunk: any) => {
      if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title };
      if (chunk.maps) return { uri: chunk.maps.uri, title: chunk.maps.title };
      return null;
    }).filter(Boolean);

    return { text, links };
  },

  async auditVisuals(fileBase64: string, providerName: string) {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: fileBase64,
      },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          imagePart,
          { text: `Analyze this image as a "Visual Auditor" for the service provider ${providerName}. Identify specific indicators of quality, professionalism, or potential structural issues. Provide a detailed trust assessment.` }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return response.text;
  },

  async generateSimulation(base64Image: string, stylePrompt: string) {
    // Upgrade to gemini-3-pro-image-preview for high-quality simulation (Gempix 2 recipe)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: `Edit this image to show a professional ${stylePrompt} transformation. Apply high-end architectural and aesthetic standards typical of a top-tier contractor.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K" // Now supported as gemini-3-pro-image-preview is a Gempix 2 recipe model
        }
      }
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }
};
