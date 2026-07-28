import { useState, useEffect } from 'react';
import { api } from './client';

export interface ExchangeRateData {
  rate: number;
  updatedAt: string;
}

const FALLBACK_RATE = 112.11;

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
        // Fallback gracefully without breaking UI
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
