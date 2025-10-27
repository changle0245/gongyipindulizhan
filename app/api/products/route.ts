import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, saveProduct, saveProducts } from '@/lib/data/products';
import { generateProductId } from '@/lib/utils';
import { Product } from '@/lib/types';

/**
 * 获取所有产品
 * GET /api/products
 */
export async function GET(request: NextRequest) {
  try {
    const products = getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * 创建新产品
 * POST /api/products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product: Product = {
      id: generateProductId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProduct(product);

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

/**
 * 批量导入产品
 * PUT /api/products
 */
export async function PUT(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products must be an array' },
        { status: 400 }
      );
    }

    saveProducts(products);

    return NextResponse.json({
      message: `${products.length} products imported successfully`,
    });
  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
