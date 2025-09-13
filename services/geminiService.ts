import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to robustly parse a data URL into its constituent parts.
const parseDataUrl = (dataUrl: string): { mimeType: string; data: string } => {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
         throw new Error("Invalid data URL format provided for image processing.");
    }
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid data URL format provided for image processing.");
    }
    return { mimeType: match[1], data: match[2] };
};

const PASSPORT_INFO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fullName: {
      type: Type.STRING,
      description: "The full name of the passport holder as written on the passport.",
    },
    nationality: {
      type: Type.STRING,
      description: "The nationality or country code of the passport holder.",
    },
    passportNumber: {
      type: Type.STRING,
      description: "The passport number.",
    },
    dateOfBirth: {
      type: Type.STRING,
      description: "The date of birth of the passport holder in YYYY-MM-DD format.",
    },
    expiryDate: {
      type: Type.STRING,
      description: "The expiry date of the passport in YYYY-MM-DD format.",
    },
  },
  required: ["fullName", "nationality", "passportNumber", "dateOfBirth", "expiryDate"],
};

const FACE_MATCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    match: {
      type: Type.BOOLEAN,
      description: "Whether the two faces are a match.",
    },
    reason: {
      type: Type.STRING,
      description: "A brief reason for the decision.",
    },
  },
  required: ["match", "reason"],
};

export interface PassportInfo {
  fullName: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  expiryDate: string;
}

export interface FaceMatchResult {
    match: boolean;
    reason: string;
}

export const extractPassportInfo = async (imageBase64: string, mimeType: string): Promise<PassportInfo> => {
  try {
    const prompt = `Analyze this image of a passport and extract the following details: full name, nationality, passport number, date of birth, and expiry date. Return the information in the specified JSON format. Ensure dates are in YYYY-MM-DD format.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: PASSPORT_INFO_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText) as PassportInfo;
    return parsedData;

  } catch (error) {
    throw new Error("Failed to analyze passport image. Please ensure the image is clear and try again.");
  }
};


export const compareFaces = async (selfieDataUrl: string, profilePicDataUrl: string): Promise<FaceMatchResult> => {
  try {
    const prompt = "Analyze these two images. Are they of the same person? Please provide a simple boolean 'match' field and a brief 'reason' string in the specified JSON format.";

    const { mimeType: selfieMimeType, data: selfieBase64 } = parseDataUrl(selfieDataUrl);
    const { mimeType: profilePicMimeType, data: profilePicBase64 } = parseDataUrl(profilePicDataUrl);

    const selfiePart = {
      inlineData: { mimeType: selfieMimeType, data: selfieBase64 },
    };

    const profilePicPart = {
      inlineData: { mimeType: profilePicMimeType, data: profilePicBase64 },
    };
    
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, selfiePart, profilePicPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: FACE_MATCH_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as FaceMatchResult;

  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid data URL")) {
        throw new Error("Failed to process one of the images. Please ensure they are valid image files and try again.");
    }
    throw new Error("Failed to compare images due to an API error. Please try again.");
  }
};

export const generateLogo = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    throw new Error("Failed to generate logo. Please try again.");
  }
};