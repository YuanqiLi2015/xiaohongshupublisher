"use server";

import { getGeminiPro } from "@/lib/gemini";
import { ProductMetadata } from "@/types";

export interface CopywritingData {
    title: string;
    body: string;
}

export async function generateCopywriting(metadata: ProductMetadata): Promise<CopywritingData> {
    const model = getGeminiPro();

    const prompt = `
    你是一个资深的小红书博主（博主名：时尚达人 OOTD），风格亲和、精致、擅长种草。
    你的目标是根据以下商品信息，编写一篇能引起共鸣并吸引互动的图文文案（笔记）。
    
    【商品信息】
    类目：${metadata.product_category}
    品牌：${metadata.brand}
    型号：${metadata.model}
    卖点：${metadata.key_features.join(", ")}
    受众：${metadata.target_audience}
    调性：${metadata.tone_keywords.join(", ")}
    
    【写作要求】
    1. 标题（Title）：标题要爆，包含 2-3 个 emoji，带一个悬念或利益点，且长度严格控制在 20 个字符以内。
    2. 正文（Body）：
       - 使用第一人称，语气亲切（如：姐妹们、真的被惊艳到、哭死）。
       - 采用分段式排版，每段开头带一个小 emoji。
       - 详细描述使用感受，结合 2-3 个核心卖点。
       - 包含 5-8 个热门标签。
    3. 引流策略（CTA）：
       - 文末设置互动物（如：求教程的姐妹评论区见、想要清单的扣1）。
       - 禁止出现“微信”“加我”“二维码”等违规词。
    
    【输出格式】
    必须返回 JSON 格式，包含以下字段：
    {
      "title": "标题内容",
      "body": "正文内容"
    }
  `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        const response = await result.response;
        const data = JSON.parse(response.text());
        return data;
    } catch (error) {
        console.error("Gemini copywriting error:", error);
        throw new Error("文案生成失败，请重试");
    }
}
