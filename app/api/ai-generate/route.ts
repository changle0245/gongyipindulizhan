import { NextRequest, NextResponse } from 'next/server';
import { generateProductFromImage, learnFromUserEdit } from '@/lib/ai/openai';
import { saveProduct } from '@/lib/data/products';
import { generateProductId } from '@/lib/utils';
import { Product } from '@/lib/types';

/**
 * AI 生成产品信息
 * POST /api/ai-generate
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const autoPublish = formData.get('autoPublish') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // 转换为 base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 使用 AI 生成产品信息
    const aiProduct = await generateProductFromImage(base64Image);

    // 如果设置自动发布，立即保存产品
    if (autoPublish) {
      const product: Product = {
        id: generateProductId(),
        ...aiProduct,
        images: [], // 图片需要单独上传
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveProduct(product);

      return NextResponse.json({
        message: 'Product generated and published',
        product,
      });
    }

    // 否则只返回AI生成的数据供审核
    return NextResponse.json({
      message: 'Product generated successfully',
      product: aiProduct,
    });
  } catch (error) {
    console.error('Error generating product:', error);
    return NextResponse.json(
      { error: 'Failed to generate product information' },
      { status: 500 }
    );
  }
}

/**
 * 从用户编辑中学习
 * PUT /api/ai-generate/learn
 */
export async function PUT(request: NextRequest) {
  try {
    const { originalAI, userEdited, imageBase64 } = await request.json();

    if (!originalAI || !userEdited) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    learnFromUserEdit(originalAI, userEdited, imageBase64 || '');

    return NextResponse.json({
      message: 'AI template updated successfully',
    });
  } catch (error) {
    console.error('Error updating AI template:', error);
    return NextResponse.json(
      { error: 'Failed to update AI template' },
      { status: 500 }
    );
  }
}
