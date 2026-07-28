// src/constants/categories.ts
export const CATEGORIES = ['Economy', 'Standard', 'Premium', 'VIP'] as const;
export type PackageCategory = typeof CATEGORIES[number];
