export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  CLASSIC = '4:3',
  SOCIAL = '3:4'
}

export interface TwinConfig {
  // Core
  mediaType: MediaType;
  visionDescription: string;
  industry: string;
  batchCount: number;
  aspectRatio: AspectRatio;
  
  // Identity
  gender: 'Woman' | 'Man';
  isUpscale: boolean; // 4K resolution
  isKid: boolean; // Kids mode active
  kidAge: string;

  // Images
  subjectImage: string | null; // Base64
  styleReferenceImage: string | null; // Base64

  // Look
  outfit: string;
  hairStyle: string;
  makeupLook: string;
  appearance: string;
  nailArt: string;
  jewelry: string;

  // Scene
  location: string;
  lighting: string;
  vehicle: string;
  props: string;
  productionDesign: string; // Luxury mode etc

  // UGC Studio
  ugcType: string;
  ugcHook: string;
  voiceTone: string;
  voiceSample: string | null; // Base64 audio
  scriptIdea: string;
}

export interface GeneratedResult {
  url: string;
  type: MediaType;
  prompt: string;
}

// Helper to keep track of loading state
export interface GenerationState {
  isLoading: boolean;
  statusMessage: string;
  results: GeneratedResult[];
  error?: string;
}