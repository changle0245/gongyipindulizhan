// 多语言文本类型
export interface MultiLangText {
  en: string;
  zh: string;
  ar: string;
}

// 产品类型定义
export interface Product {
  id: string;
  name: MultiLangText;
  description: MultiLangText;
  category: string;
  images: string[];
  specifications: {
    dimensions: MultiLangText;
    material: MultiLangText;
    craftsmanship: MultiLangText;
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
  name: MultiLangText;
  slug: string;
  description: MultiLangText;
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
  customImages?: string[]; // 客户上传的自定义产品图片
}

// AI 生成的产品信息
export interface AIGeneratedProduct {
  name: MultiLangText;
  description: MultiLangText;
  specifications: {
    dimensions: MultiLangText;
    material: MultiLangText;
    craftsmanship: MultiLangText;
    price: string;
    moq: string;
  };
  seoKeywords: string[];
  category: string;
}

// AI 模板配置
export interface AITemplate {
  id: string;
  name: string;
  prompt: string;
  examples: {
    input: string;
    output: AIGeneratedProduct;
  }[];
  createdAt: string;
  updatedAt: string;
}

// 邮箱配置
export interface EmailConfig {
  department: string; // 部门名称，如 "销售部"、"外贸部"
  email: string;
  enabled: boolean;
}

// 系统配置
export interface SystemConfig {
  emails: EmailConfig[];
  aiTemplate?: AITemplate;
  smtpConfig?: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}
