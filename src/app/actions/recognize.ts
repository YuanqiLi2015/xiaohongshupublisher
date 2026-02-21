"use server";

import { getGeminiPro } from "@/lib/gemini";
import { ProductMetadata } from "@/types";

export async function recognizeProduct(base64Image: string): Promise<ProductMetadata> {
    const model = getGeminiPro();

    const prompt = `
    你是一个专业的小红书电商专家和商品识别助手。
    请分析这张图片，识别其中的主要商品，并输出其详细参数。
    如果是全品类商品，请尽可能精确。
    
    请严格按照以下 JSON 格式输出，不要包含任何 Markdown 代码块标签或其他多余文字：
    {
      "product_category": "商品二级类目",
      "brand": "品牌名称",
      "model": "具体型号",
      "estimated_price_range": "预估价格区间",
      "key_features": ["卖点1", "卖点2", "卖点3"],
      "target_audience": "受众群体描述",
      "tone_keywords": ["调性关键词1", "关键词2"],
      "confidence": 0.0-1.0 之间的置信度
    }
  `;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image.split(",")[1] || base64Image,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean potential markdown formatting
        const jsonString = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonString) as ProductMetadata;
    } catch (error) {
        console.error("Gemini recognition error:", error);
        throw new Error("商品识别失败，请重试");
    }
}
