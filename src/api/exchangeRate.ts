// src/api/exchangeRate.ts
import { useState, useEffect } from 'react';
import { api } from './client';

export interface ExchangeRateData {
  rate: number;
  updatedAt: string;
}

const FALLBACK_RATE = 159.98;
let cachedRate: number | null = null;
let rateLastUpdated: string | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchExchangeRate(): Promise<number> {
  // Check cache
  if (cachedRate && rateLastUpdated && (Date.now() - new Date(rateLastUpdated).getTime() < CACHE_DURATION)) {
    return cachedRate;
  }

  try {
    const response = await api.get<{ success?: boolean; data?: { rate: number; updatedAt?: string } }>('/exchange-rate');
    if (response?.data?.rate) {
      cachedRate = response.data.rate;
      rateLastUpdated = response.data.updatedAt || new Date().toISOString();
      return cachedRate;
    }
    return FALLBACK_RATE;
  } catch (err) {
    console.warn('Exchange rate fetch failed, using fallback:', err);
    return FALLBACK_RATE;
  }
}

export function useExchangeRate() {
  const [rate, setRate] = useState<number>(FALLBACK_RATE);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Rate');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRate() {
      try {
        const response = await api.get<{ success?: boolean; data?: { rate: number; updatedAt?: string } }>('/exchange-rate');
        if (isMounted && response?.data?.rate) {
          setRate(response.data.rate);
          if (response.data.updatedAt) {
            setLastUpdated(new Date(response.data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            setLastUpdated('Updated Today');
          }
        }
      } catch (err) {
        if (isMounted) {
          setRate(FALLBACK_RATE);
          setLastUpdated('Official Rate');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRate();
  }, []);

  return { rate, lastUpdated, loading };
}

export function formatPriceEtb(usdPrice: number, exchangeRate: number): string {
  const etbPrice = Math.round(usdPrice * exchangeRate);
  return `${etbPrice.toLocaleString()} ETB`;
}

export function formatPrice(priceUsd: number, currency: 'USD' | 'ETB' | 'SAR', rate: number): string {
  if (currency === 'ETB') {
    return `${Math.round(priceUsd * rate).toLocaleString()} ETB`;
  }
  if (currency === 'SAR') {
    const sarRate = rate / 3.75; // Approximate SAR rate
    return `${Math.round(priceUsd * sarRate).toLocaleString()} SAR`;
  }
  return `$${priceUsd.toFixed(2)}`;
}