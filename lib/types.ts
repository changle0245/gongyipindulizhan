// 产品类型定义
export interface Product {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  category: string;
  images: string[];
  specifications: {
    dimensions: {
      en: string;
      zh: string;
    };
    material: {
      en: string;
      zh: string;
    };
    craftsmanship: {
      en: string;
      zh: string;
    };
    price: string;
    moq: string;
  };
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

// 产品分类
export interface Category {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  slug: string;
  description: {
    en: string;
    zh: string;
  };
}

// 询价单
export interface QuoteRequest {
  customerName: string;
  email: string;
  company?: string;
  phone?: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  message?: string;
}

// AI 生成的产品信息
export interface AIGeneratedProduct {
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  specifications: {
    dimensions: {
      en: string;
      zh: string;
    };
    material: {
      en: string;
      zh: string;
    };
    craftsmanship: {
      en: string;
      zh: string;
    };
    price: string;
    moq: string;
  };
  seoKeywords: string[];
  category: string;
}
