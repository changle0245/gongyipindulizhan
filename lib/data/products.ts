import fs from 'fs';
import path from 'path';
import { Product, Category } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * 获取所有产品
 */
export function getAllProducts(): Product[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

/**
 * 根据 ID 获取产品
 */
export function getProductById(id: string): Product | null {
  const products = getAllProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * 根据分类获取产品
 */
export function getProductsByCategory(category: string): Product[] {
  const products = getAllProducts();
  return products.filter((p) => p.category === category);
}

/**
 * 搜索产品
 */
export function searchProducts(query: string, locale: 'en' | 'zh'): Product[] {
  const products = getAllProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter((product) => {
    const name = product.name[locale].toLowerCase();
    const description = product.description[locale].toLowerCase();
    const keywords = product.seoKeywords.join(' ').toLowerCase();

    return (
      name.includes(lowerQuery) ||
      description.includes(lowerQuery) ||
      keywords.includes(lowerQuery)
    );
  });
}

/**
 * 保存产品
 */
export function saveProduct(product: Product): void {
  ensureDataDir();
  const products = getAllProducts();

  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

/**
 * 批量保存产品
 */
export function saveProducts(products: Product[]): void {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

/**
 * 获取所有分类
 */
export function getAllCategories(): Category[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(CATEGORIES_FILE)) {
      // 返回默认分类
      return [
        {
          id: 'metal-crafts',
          name: { en: 'Metal Crafts', zh: '金属工艺品', ar: 'الحرف المعدنية' },
          slug: 'metal-crafts',
          description: {
            en: 'High-quality metal craft products',
            zh: '高品质金属工艺品',
            ar: 'منتجات الحرف المعدنية عالية الجودة'
          }
        }
      ];
    }
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

/**
 * 保存分类
 */
export function saveCategories(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
}

/**
 * 获取产品统计信息
 */
export function getProductStats() {
  const products = getAllProducts();
  const categories = getAllCategories();

  const stats = {
    total: products.length,
    byCategory: {} as Record<string, number>,
  };

  categories.forEach(cat => {
    stats.byCategory[cat.id] = products.filter(p => p.category === cat.id).length;
  });

  return stats;
}
