import { GoogleGenAI } from "@google/genai";
import { TwinConfig, GeneratedResult, MediaType } from "../types";

// Helper to remove base64 header if present
const cleanBase64 = (b64: string) => {
  return b64.replace(/^data:image\/\w+;base64,/, "");
};

// Check for API Key selection (required for Veo/Luxury models)
export const checkAndSelectKey = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
     const hasKey = await window.aistudio.hasSelectedApiKey();
     if (!hasKey) {
        await window.aistudio.openSelectKey();
     }
  }
};

export const generateMedia = async (config: TwinConfig): Promise<GeneratedResult[]> => {
  // Ensure we have a fresh client with the potentially selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = constructPrompt(config);

  if (config.mediaType === MediaType.VIDEO) {
    return generateVideo(ai, prompt, config);
  } else {
    return generateImages(ai, prompt, config);
  }
};

const constructPrompt = (config: TwinConfig): string => {
  const {
    visionDescription, industry, outfit, hairStyle, makeupLook, 
    nailArt, location, vehicle, props, lighting, productionDesign, 
    appearance, jewelry, ugcType, ugcHook, voiceTone, scriptIdea,
    gender, isKid, kidAge
  } = config;

  // Enhance prompt keyword with Upscale requested (8K)
  const enhance = "Hyper-realistic, 8k resolution, highly detailed, photorealistic textures, boss-level aesthetics.";
  
  // Mandatory face match text requested by user
  // Switches gender word based on selection
  const mandatoryIdentityText = `(Based on the image without changing any identical features, create an 8K cinematic editorial photography scene of the same ${gender.toLowerCase()} with identical facial features, body, and overall appearance as before.)`;

  let roleDescription = isKid 
    ? `a ${kidAge} child representing a future ${industry} professional` 
    : `a ${industry} professional`;

  let promptText = `
    ${mandatoryIdentityText}
    Create a ${enhance} ${config.mediaType === MediaType.VIDEO ? 'video' : 'image'} of ${roleDescription}.
    
    **Identity & Style**:
    - Gender: ${gender}
    ${isKid ? `- Age: ${kidAge}` : ''}
    - Hair: ${hairStyle}
    - Makeup: ${isKid ? 'Natural/None' : makeupLook}
    - Nails: ${isKid ? 'Natural' : nailArt}
    - Appearance: ${appearance}
    - Outfit: ${outfit}
    - Jewelry: ${jewelry}
    
    **Scene & Environment**:
    - Location: ${location}
    - Lighting: ${lighting}
    - Production Design: ${productionDesign}
    - Props: ${props}
    ${vehicle !== 'None' ? `- Vehicle nearby: ${vehicle}` : ''}
  `;

  // Add UGC details if active
  if (ugcType && ugcType !== 'None') {
    promptText += `
    **UGC Content Style**:
    - Content Type: ${ugcType} (Social Media/Influencer style)
    - Hook Visual: ${ugcHook}
    - Vibe/Tone: ${voiceTone} (Visual body language matching this tone)
    ${scriptIdea ? `- Context/Topic: ${scriptIdea}` : ''}
    - Camera Angle: Selfie-style, handheld vlog, or tripod setup (typical for UGC).
    - Engagement: Subject is looking directly at the camera, engaging the audience.
    `;
  }

  promptText += `
    **Context & Mood**:
    ${visionDescription}
    
    CRITICAL: The face MUST match the subject reference image exactly. Do not alter facial structure, eye shape, or key identifying features.
  `;

  return promptText.trim();
};

const generateImages = async (ai: GoogleGenAI, prompt: string, config: TwinConfig): Promise<GeneratedResult[]> => {
  const model = "gemini-3-pro-image-preview"; 
  
  const results: GeneratedResult[] = [];
  
  const parts: any[] = [];
  
  if (config.subjectImage) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", 
        data: cleanBase64(config.subjectImage)
      }
    });
    parts.push({ text: "Use this image as the primary reference for the subject's face and body structure (Face Match)." });
  }

  if (config.styleReferenceImage) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64(config.styleReferenceImage)
      }
    });
    parts.push({ text: "Use this image as a reference for the style, color palette, and clothing texture." });
  }

  parts.push({ text: prompt });

  const loopCount = Math.min(Math.max(1, config.batchCount), 4);
  
  // Set image size based on Upscale config
  // 1K is default, 4K if upscaled
  const imageSize = config.isUpscale ? "4K" : "1K";

  const promises = Array.from({ length: loopCount }).map(async () => {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio,
            imageSize: imageSize
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return {
            url: `data:image/png;base64,${part.inlineData.data}`,
            type: MediaType.IMAGE,
            prompt: prompt
          };
        }
      }
    } catch (e) {
      console.error("Image generation failed for one batch item", e);
      return null;
    }
    return null;
  });

  const generated = await Promise.all(promises);
  return generated.filter((r): r is GeneratedResult => r !== null);
};

const generateVideo = async (ai: GoogleGenAI, prompt: string, config: TwinConfig): Promise<GeneratedResult[]> => {
  // Veo doesn't support '4K' resolution in the config param directly for the simplified API in some versions,
  // but we can request high quality via prompt or resolution 1080p (max usually for preview).
  
  const model = 'veo-3.1-fast-generate-preview'; 

  try {
    const imageInput = config.subjectImage ? {
        imageBytes: cleanBase64(config.subjectImage),
        mimeType: 'image/jpeg'
    } : undefined;

    let operation = await ai.models.generateVideos({
      model,
      prompt: prompt,
      image: imageInput,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: config.aspectRatio === '9:16' ? '9:16' : '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (videoUri) {
        const vidResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await vidResponse.blob();
        const url = URL.createObjectURL(blob);
        
        return [{
            url,
            type: MediaType.VIDEO,
            prompt
        }];
    }

    return [];

  } catch (error) {
    console.error("Video generation failed", error);
    throw error;
  }
};