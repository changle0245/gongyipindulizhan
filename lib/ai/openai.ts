import OpenAI from 'openai';
import { AIGeneratedProduct, AITemplate } from '../types';
import fs from 'fs';
import path from 'path';

const TEMPLATE_FILE = path.join(process.cwd(), 'data', 'ai-template.json');

/**
 * 获取 OpenAI 客户端实例
 */
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
}

/**
 * 获取 AI 模板
 */
export function getAITemplate(): AITemplate | null {
  try {
    if (fs.existsSync(TEMPLATE_FILE)) {
      const data = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading AI template:', error);
  }
  return null;
}

/**
 * 保存 AI 模板
 */
export function saveAITemplate(template: AITemplate): void {
  const dir = path.dirname(TEMPLATE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(TEMPLATE_FILE, JSON.stringify(template, null, 2));
}

/**
 * 构建 AI 提示词（包含模板和示例）
 */
function buildPrompt(template?: AITemplate | null): string {
  let basePrompt = `You are a metal craft product expert specializing in Islamic and Middle Eastern decorative items. Analyze this product image and generate detailed product information in English, Chinese, and Arabic.

Please respond in JSON format with the following structure:
{
  "name": {
    "en": "English product name",
    "zh": "中文产品名称",
    "ar": "اسم المنتج بالعربية"
  },
  "description": {
    "en": "Detailed English description (2-3 sentences, professional B2B tone)",
    "zh": "详细中文描述（2-3句话，专业B2B语气）",
    "ar": "وصف مفصل بالعربية (2-3 جمل، لهجة احترافية B2B)"
  },
  "specifications": {
    "dimensions": {
      "en": "Estimated dimensions (e.g., 10cm x 15cm x 20cm)",
      "zh": "预估尺寸（如：10厘米 x 15厘米 x 20厘米）",
      "ar": "الأبعاد المقدرة (على سبيل المثال، 10 سم × 15 سم × 20 سم)"
    },
    "material": {
      "en": "Material type (e.g., Stainless Steel, Bronze, Iron, Brass)",
      "zh": "材质（如：不锈钢、青铜、铁、黄铜）",
      "ar": "نوع المادة (على سبيل المثال، الفولاذ المقاوم للصدأ، البرونز، الحديد، النحاس)"
    },
    "craftsmanship": {
      "en": "Craftsmanship technique (e.g., Hand-forged, Cast, Welded, Engraved)",
      "zh": "工艺技术（如：手工锻造、铸造、焊接、雕刻）",
      "ar": "تقنية الحرفية (على سبيل المثال، مطروق يدويًا، صب، لحام، منقوش)"
    },
    "price": "Contact for Quote",
    "moq": "100 pieces"
  },
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "category": "incense-burner"
}

Categories available: incense-burner, dry-fruit-box, glass-iron-fruit-plate, iron-dining-table, iron-ornaments

Be specific and professional. Generate realistic specifications based on what you see in the image.`;

  // 如果有自定义模板，添加自定义提示词和示例
  if (template && template.prompt) {
    basePrompt += `\n\nADDITIONAL GUIDELINES:\n${template.prompt}`;
  }

  if (template && template.examples && template.examples.length > 0) {
    basePrompt += `\n\nEXAMPLES OF PREFERRED OUTPUT STYLE:\n`;
    template.examples.slice(0, 2).forEach((example, index) => {
      basePrompt += `\nExample ${index + 1}:\n${JSON.stringify(example.output, null, 2)}\n`;
    });
  }

  return basePrompt;
}

/**
 * 使用 GPT-4 Vision 分析产品图片并生成产品信息（支持多语言和模板学习）
 */
export async function generateProductFromImage(
  imageBase64: string,
  useTemplate: boolean = true
): Promise<AIGeneratedProduct> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const template = useTemplate ? getAITemplate() : null;
    const prompt = buildPrompt(template);

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
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
      max_tokens: 2000,
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

    // 确保所有必需字段都存在
    if (!productData.name || !productData.description || !productData.specifications) {
      throw new Error('Incomplete product data from AI');
    }

    return productData;
  } catch (error) {
    console.error('Error generating product from image:', error);
    throw new Error('Failed to generate product information from image');
  }
}

/**
 * 从用户修改中学习并更新 AI 模板
 */
export function learnFromUserEdit(
  originalAI: AIGeneratedProduct,
  userEdited: AIGeneratedProduct,
  imageBase64: string
): void {
  let template = getAITemplate();

  if (!template) {
    template = {
      id: 'default',
      name: 'Default Template',
      prompt: '',
      examples: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // 添加新示例（保留最近的10个示例）
  template.examples.push({
    input: imageBase64.substring(0, 100), // 只存储图片的hash或简短标识
    output: userEdited,
  });

  if (template.examples.length > 10) {
    template.examples = template.examples.slice(-10);
  }

  template.updatedAt = new Date().toISOString();

  saveAITemplate(template);
}
