import { Category } from '../types';

// 预定义的产品分类
export const defaultCategories: Category[] = [
  {
    id: 'incense-burner',
    name: {
      en: 'Incense Burner',
      zh: '香炉',
      ar: 'مبخرة'
    },
    slug: 'incense-burner',
    description: {
      en: 'Traditional and modern incense burners',
      zh: '传统和现代香炉',
      ar: 'مباخر تقليدية وحديثة'
    }
  },
  {
    id: 'dry-fruit-box',
    name: {
      en: 'Dry Fruit Box',
      zh: '干果盒',
      ar: 'صندوق الفواكه المجففة'
    },
    slug: 'dry-fruit-box',
    description: {
      en: 'Elegant boxes for dry fruits and nuts',
      zh: '优雅的干果和坚果盒',
      ar: 'صناديق أنيقة للفواكه المجففة والمكسرات'
    }
  },
  {
    id: 'glass-iron-fruit-plate',
    name: {
      en: 'Glass & Iron Fruit Plate',
      zh: '玻璃铁艺果盘',
      ar: 'طبق فواكه من الزجاج والحديد'
    },
    slug: 'glass-iron-fruit-plate',
    description: {
      en: 'Beautiful combination of glass and iron craftsmanship',
      zh: '玻璃与铁艺的完美结合',
      ar: 'مزيج جميل من الحرفية الزجاجية والحديدية'
    }
  },
  {
    id: 'iron-dining-table',
    name: {
      en: 'Iron Dining Table',
      zh: '铁艺餐桌',
      ar: 'طاولة طعام من الحديد'
    },
    slug: 'iron-dining-table',
    description: {
      en: 'Durable and stylish iron dining tables',
      zh: '耐用时尚的铁艺餐桌',
      ar: 'طاولات طعام حديدية متينة وأنيقة'
    }
  },
  {
    id: 'iron-ornaments',
    name: {
      en: 'Iron Ornaments',
      zh: '铁艺摆件',
      ar: 'زينة من الحديد'
    },
    slug: 'iron-ornaments',
    description: {
      en: 'Decorative iron ornaments for home and office',
      zh: '家居和办公室装饰铁艺摆件',
      ar: 'زينة حديدية للمنزل والمكتب'
    }
  }
];

// 获取所有分类（如果需要从文件系统读取，可以在这里实现）
export function getCategories(): Category[] {
  return defaultCategories;
}

// 根据 slug 获取分类
export function getCategoryBySlug(slug: string): Category | undefined {
  return defaultCategories.find(cat => cat.slug === slug);
}

// 根据 ID 获取分类
export function getCategoryById(id: string): Category | undefined {
  return defaultCategories.find(cat => cat.id === id);
}
