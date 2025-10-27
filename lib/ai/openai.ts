import OpenAI from 'openai';
import { AIGeneratedProduct } from '../types';

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 使用 GPT-4 Vision 分析产品图片并生成产品信息
 */
export async function generateProductFromImage(
  imageBase64: string
): Promise<AIGeneratedProduct> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a metal craft product expert. Analyze this product image and generate detailed product information in both English and Chinese.

Please respond in JSON format with the following structure:
{
  "name": {
    "en": "English product name",
    "zh": "中文产品名称"
  },
  "description": {
    "en": "Detailed English description (2-3 sentences)",
    "zh": "详细中文描述（2-3句话）"
  },
  "specifications": {
    "dimensions": {
      "en": "Estimated dimensions (e.g., 10cm x 15cm x 20cm)",
      "zh": "预估尺寸（如：10厘米 x 15厘米 x 20厘米）"
    },
    "material": {
      "en": "Material type (e.g., Stainless Steel, Bronze, Iron)",
      "zh": "材质（如：不锈钢、青铜、铁）"
    },
    "craftsmanship": {
      "en": "Craftsmanship technique (e.g., Hand-forged, Cast, Welded)",
      "zh": "工艺技术（如：手工锻造、铸造、焊接）"
    },
    "price": "Estimated price range (e.g., 50-100)",
    "moq": "Suggested MOQ (e.g., 100 pieces)"
  },
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "category": "metal-crafts"
}

Be specific and professional. Generate realistic specifications based on what you see in the image.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // 提取 JSON 部分
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    const productData: AIGeneratedProduct = JSON.parse(jsonMatch[0]);
    return productData;
  } catch (error) {
    console.error('Error generating product from image:', error);
    throw new Error('Failed to generate product information from image');
  }
}
