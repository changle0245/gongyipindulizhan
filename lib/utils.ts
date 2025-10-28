import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 生成产品 ID
export function generateProductId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 格式化价格
export function formatPrice(price: string, locale: string): string {
  if (locale === 'zh') {
    return `¥${price}`;
  }
  return `$${price}`;
}

// 从文件名生成 slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
