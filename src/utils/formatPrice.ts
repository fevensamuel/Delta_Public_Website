import { Currency, Language } from '../types';

export function formatPrice(usdAmount: number, currency: Currency, lang: Language): string {
  if (currency === 'USD') {
    return `$${usdAmount.toLocaleString()}`;
  }
  
  // Exchange rate: 1 USD ~ 125 ETB
  const etbValue = Math.round(usdAmount * 125);
  
  if (lang === 'AM') {
    return `${etbValue.toLocaleString()} ብር`;
  }
  if (lang === 'AR') {
    return `${etbValue.toLocaleString()} بر إثيوبي`;
  }
  return `${etbValue.toLocaleString()} ETB`;
}
