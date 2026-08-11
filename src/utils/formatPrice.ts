// src/utils/formatPrice.ts
import { Currency, Language } from '../types';

// Default fallback rate if API fails
const DEFAULT_ETB_RATE = 159.98;

/**
 * Format price based on currency and language
 * @param usdAmount - The price in USD
 * @param currency - The currency to display (USD, ETB, SAR)
 * @param lang - The language for formatting (EN, AR, AM)
 * @param exchangeRate - The current USD to ETB exchange rate (optional, will use default if not provided)
 * @returns Formatted price string
 */
export function formatPrice(
  usdAmount: number,
  currency: Currency,
  lang: Language,
  exchangeRate: number = 159.98
): string {
  if (currency === 'USD') {
    return `$${usdAmount.toFixed(2)}`;
  }

  if (currency === 'SAR') {
    const sarValue = Math.round(usdAmount * 3.75);
    if (lang === 'AR') {
      return `${sarValue.toLocaleString()} ريال`;
    }
    if (lang === 'AM') {
      return `${sarValue.toLocaleString()} ሳዑዲ ሪያል`;
    }
    return `${sarValue.toLocaleString()} SAR`;
  }
  
  // ETB
  const etbValue = Math.round(usdAmount * exchangeRate);
  if (lang === 'AM') {
    return `${etbValue.toLocaleString()} ብር`;
  }
  if (lang === 'AR') {
    return `${etbValue.toLocaleString()} بر إثيوبي`;
  }
  return `${etbValue.toLocaleString()} ETB`;
}

/**
 * Get the ETB price as a number
 * @param usdAmount - The price in USD
 * @param exchangeRate - The current USD to ETB exchange rate
 * @returns The ETB price as a rounded number
 */
export function getEtbPrice(usdAmount: number, exchangeRate: number = DEFAULT_ETB_RATE): number {
  return Math.round(usdAmount * exchangeRate);
}

/**
 * Format ETB price only
 * @param etbAmount - The price in ETB
 * @param lang - The language for formatting
 * @returns Formatted ETB price string
 */
export function formatEtbPrice(etbAmount: number, lang: Language): string {
  if (lang === 'AM') {
    return `${etbAmount.toLocaleString()} ብር`;
  }
  if (lang === 'AR') {
    return `${etbAmount.toLocaleString()} بر إثيوبي`;
  }
  return `${etbAmount.toLocaleString()} ETB`;
}