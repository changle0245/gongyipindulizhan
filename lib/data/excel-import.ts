import * as XLSX from 'xlsx';
import { Product } from '../types';
import { generateProductId, slugify } from '../utils';

/**
 * 从 Excel 文件导入产品数据
 *
 * Excel 文件格式示例：
 * | ID | Name_EN | Name_ZH | Desc_EN | Desc_ZH | Category | Images | Dimensions_EN | Dimensions_ZH | Material_EN | Material_ZH | Craftsmanship_EN | Craftsmanship_ZH | Price | MOQ | Keywords |
 */
export function importProductsFromExcel(filePath: string): Product[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 转换为 JSON
  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

  const products: Product[] = rawData.map((row) => {
    const id = row.ID || generateProductId();
    const images = row.Images ? row.Images.split(',').map((img: string) => img.trim()) : [];
    const keywords = row.Keywords ? row.Keywords.split(',').map((kw: string) => kw.trim()) : [];

    return {
      id,
      name: {
        en: row.Name_EN || '',
        zh: row.Name_ZH || '',
        ar: row.Name_AR || row.Name_EN || '',
      },
      description: {
        en: row.Desc_EN || '',
        zh: row.Desc_ZH || '',
        ar: row.Desc_AR || row.Desc_EN || '',
      },
      category: row.Category || 'metal-crafts',
      images,
      specifications: {
        dimensions: {
          en: row.Dimensions_EN || '',
          zh: row.Dimensions_ZH || '',
          ar: row.Dimensions_AR || row.Dimensions_EN || '',
        },
        material: {
          en: row.Material_EN || '',
          zh: row.Material_ZH || '',
          ar: row.Material_AR || row.Material_EN || '',
        },
        craftsmanship: {
          en: row.Craftsmanship_EN || '',
          zh: row.Craftsmanship_ZH || '',
          ar: row.Craftsmanship_AR || row.Craftsmanship_EN || '',
        },
        price: row.Price?.toString() || '',
        moq: row.MOQ?.toString() || '',
      },
      seoKeywords: keywords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  return products;
}

/**
 * 导出产品数据到 Excel
 */
export function exportProductsToExcel(products: Product[], outputPath: string): void {
  const data = products.map((product) => ({
    ID: product.id,
    Name_EN: product.name.en,
    Name_ZH: product.name.zh,
    Desc_EN: product.description.en,
    Desc_ZH: product.description.zh,
    Category: product.category,
    Images: product.images.join(', '),
    Dimensions_EN: product.specifications.dimensions.en,
    Dimensions_ZH: product.specifications.dimensions.zh,
    Material_EN: product.specifications.material.en,
    Material_ZH: product.specifications.material.zh,
    Craftsmanship_EN: product.specifications.craftsmanship.en,
    Craftsmanship_ZH: product.specifications.craftsmanship.zh,
    Price: product.specifications.price,
    MOQ: product.specifications.moq,
    Keywords: product.seoKeywords.join(', '),
    Created: product.createdAt,
    Updated: product.updatedAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  XLSX.writeFile(workbook, outputPath);
}
