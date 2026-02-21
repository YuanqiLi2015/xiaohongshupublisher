"use server";

import { getNanoBanana } from "@/lib/gemini";
import { ProductMetadata } from "@/types";

export async function generateCoverImage(metadata: ProductMetadata): Promise<string> {
    const model = getNanoBanana();

    // Create a descriptive prompt for image generation based on metadata
    const prompt = `
    Product promotional photography for Xiaohongshu (XHS).
    Subject: ${metadata.brand} ${metadata.model} (${metadata.product_category}).
    Features to highlight: ${metadata.key_features.join(", ")}.
    Style: ${metadata.tone_keywords.join(", ")}, elegant, minimal, high-end magazine style.
    Setting: Minimalist studio background with soft lighting, rose gold accents, aesthetic composition.
    
    Technical Requirements:
    - 3:4 Vertical Aspect Ratio.
    - High resolution, detailed textures.
    - No text or watermarks.
    - Professional commercial photography lighting.
  `;

    try {
        // Note: The generateContent call for image generation models returns image data in the response
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // In a real environment, this would return a base64 or a URL. 
        // For the purpose of this implementation, we assume the API returns the image in the response parts.
        // As the SDK usage for image gen might vary, we'll look for blob data.

        const candidate = response.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find(part => part.inlineData || part.fileData);

        if (imagePart?.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }

        // Fallback: If the model returns text (describing success or a URL), handle it.
        // In some versions of the Gemini Image Gen API, it might be structured differently.
        // Since we are in a developer environment, if it fails to return an image blob, 
        // we'll try to extract a URL if provided in text.

        const text = response.text();
        if (text.startsWith("http")) return text.trim();

        throw new Error("模型未返回图像数据");
    } catch (error) {
        console.error("Image generation error:", error);
        throw new Error("宣传图生成失败，请重试");
    }
}
