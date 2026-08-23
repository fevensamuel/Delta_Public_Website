// src/utils/formatPrice.ts
import { Currency, Language } from '../types';

/**
 * Format price based on currency and language
 * Uses the price from the backend directly - no calculation
 */
export function formatPrice(
  priceUsd: number,
  priceEtb: number | undefined,
  priceSar: number | undefined,
  currency: Currency,
  lang: Language,
  fallbackRate: number = 159.98
): string {
  const currencySymbols = {
    USD: '$',
    ETB: 'Br',
    SAR: '﷼'
  };

  let price = 0;
  let symbol = currencySymbols[currency] || '$';

  switch (currency) {
    case 'USD':
      price = priceUsd;
      symbol = '$';
      break;
    case 'ETB':
      price = priceEtb !== undefined && priceEtb > 0 ? priceEtb : Math.round(priceUsd * fallbackRate);
      symbol = 'Br';
      break;
    case 'SAR':
      price = priceSar !== undefined && priceSar > 0 ? priceSar : Math.round(priceUsd * 3.75);
      symbol = '﷼';
      break;
  }

  const formattedPrice = Math.round(price).toLocaleString();

  if (lang === 'AR') {
    return `${formattedPrice} ${symbol}`;
  }
  if (lang === 'AM') {
    return `${formattedPrice} ${symbol}`;
  }

  return `${symbol}${formattedPrice}`;
}

/**
 * Format price range
 */
export function formatPriceRange(
  priceUsdMin: number,
  priceUsdMax: number,
  priceEtbMin: number | undefined,
  priceEtbMax: number | undefined,
  priceSarMin: number | undefined,
  priceSarMax: number | undefined,
  currency: Currency,
  lang: Language,
  fallbackRate: number = 159.98
): string {
  // If min and max are the same, just show single price
  if (priceUsdMin === priceUsdMax) {
    return formatPrice(priceUsdMin, priceEtbMin, priceSarMin, currency, lang, fallbackRate);
  }
  
  const minFormatted = formatPrice(priceUsdMin, priceEtbMin, priceSarMin, currency, lang, fallbackRate);
  const maxFormatted = formatPrice(priceUsdMax, priceEtbMax, priceSarMax, currency, lang, fallbackRate);
  
  if (lang === 'AR') {
    return `${maxFormatted} - ${minFormatted}`;
  }
  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Get price for a specific person category
 */
export function formatPersonPrice(
  person: any,
  currency: Currency,
  lang: Language,
  fallbackRate: number = 159.98
): string {
  const priceUsd = person.priceUsd || 0;
  const priceEtb = person.priceEtb || 0;
  const priceSar = person.priceSar || 0;
  
  return formatPrice(priceUsd, priceEtb, priceSar, currency, lang, fallbackRate);
}

/**
 * Format discounted price
 */
export function formatDiscountedPrice(
  originalPriceUsd: number,
  discount: any,
  currency: Currency,
  lang: Language,
  fallbackRate: number = 159.98
): string {
  let discountedUsd = originalPriceUsd;
  
  if (discount.type === 'percentage') {
    discountedUsd = originalPriceUsd - (originalPriceUsd * discount.value / 100);
  } else {
    discountedUsd = originalPriceUsd - discount.value;
  }
  
  const discountedEtb = Math.round(discountedUsd * fallbackRate);
  const discountedSar = Math.round(discountedUsd * 3.75);
  
  return formatPrice(discountedUsd, discountedEtb, discountedSar, currency, lang, fallbackRate);
}

/**
 * Get discount display text
 */
export function getDiscountDisplay(discount: any, lang: Language): string {
  const label = lang === 'AR' ? (discount.labelAr || discount.label) : discount.label;
  
  if (discount.type === 'percentage') {
    return `${discount.value}% ${lang === 'AR' ? 'خصم' : 'off'} - ${label}`;
  } else {
    return `$${discount.value} ${lang === 'AR' ? 'خصم' : 'off'} - ${label}`;
  }
}