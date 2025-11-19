export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedObject {
  name: string;
  description: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

export interface AnalysisResult {
  objects: DetectedObject[];
}

export type ModelType = 'gemini-2.5-flash' | 'gemini-3-pro-preview';

export interface AppState {
  apiKey: string;
  model: ModelType;
  target: string;
  selectedImage: string | null; // Base64 string
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
