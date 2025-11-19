import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ModelType } from "../types";

export const analyzeImage = async (
  apiKey: string,
  modelId: ModelType,
  imageBase64: string,
  target: string
): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("APIキーが設定されていません。");

  const ai = new GoogleGenAI({ apiKey });

  // Remove prefix if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = imageBase64.split(",")[1] || imageBase64;

  const prompt = `
    この画像に写っている「${target}」に関連する物体を検出してください。
    各物体について、以下の情報を含むJSONを返してください：
    1. box_2d: バウンディングボックス座標 [ymin, xmin, ymax, xmax] (0から1の範囲)。
    2. name: 物体の名称（日本語）。
    3. description: その物体の詳細な解説（日本語）。図鑑のようなトーンで、特徴や用途などを50文字〜100文字程度で説明してください。
    
    画像内に該当する物体がない場合は、空の配列を返してください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, or detect from header
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "ymin, xmin, ymax, xmax",
                  },
                },
                required: ["name", "description", "box_2d"],
              },
            },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error("Geminiからの応答が空でした。");
    }

    const jsonResult = JSON.parse(response.text) as AnalysisResult;
    return jsonResult;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "画像の解析中にエラーが発生しました。");
  }
};
