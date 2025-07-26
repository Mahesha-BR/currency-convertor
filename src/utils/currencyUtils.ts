import { Currency, ExchangeRate, ConversionResult } from '../types/currency';

// Mock exchange rates - in a real app, you'd fetch from an API like Fixer.io, CurrencyAPI, etc.
const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92,
    CNY: 6.45,
    SEK: 8.75,
    NZD: 1.42,
    MXN: 20.15,
    SGD: 1.35,
    HKD: 7.85,
    NOK: 8.65,
    KRW: 1180.0,
    TRY: 8.45,
    RUB: 75.0,
    INR: 74.5,
    BRL: 5.25,
    ZAR: 14.75,
    PLN: 3.85,
    ILS: 3.25,
    DKK: 6.35,
    CZK: 21.5,
    HUF: 295.0,
    BGN: 1.66,
    RON: 4.15,
    HRK: 6.42,
    ISK: 125.0,
    PHP: 50.5,
    MYR: 4.15,
    THB: 31.5,
    IDR: 14250.0,
  }
};

// Generate reverse rates
Object.keys(mockExchangeRates.USD).forEach(currency => {
  if (!mockExchangeRates[currency]) {
    mockExchangeRates[currency] = {};
  }
  mockExchangeRates[currency].USD = 1 / mockExchangeRates.USD[currency];
});

// Generate cross rates
Object.keys(mockExchangeRates).forEach(baseCurrency => {
  Object.keys(mockExchangeRates).forEach(targetCurrency => {
    if (baseCurrency !== targetCurrency && !mockExchangeRates[baseCurrency][targetCurrency]) {
      const baseToUSD = baseCurrency === 'USD' ? 1 : mockExchangeRates[baseCurrency].USD;
      const usdToTarget = targetCurrency === 'USD' ? 1 : mockExchangeRates.USD[targetCurrency];
      mockExchangeRates[baseCurrency][targetCurrency] = baseToUSD * usdToTarget;
    }
  });
});

export const getExchangeRate = async (from: string, to: string): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (from === to) return 1;
  
  // Add some random fluctuation to make it more realistic
  const baseRate = mockExchangeRates[from]?.[to] || 1;
  const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
  return baseRate * (1 + fluctuation);
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): Promise<ConversionResult> => {
  const rate = await getExchangeRate(fromCurrency.code, toCurrency.code);
  const convertedAmount = amount * rate;
  
  return {
    fromAmount: amount,
    toAmount: convertedAmount,
    fromCurrency,
    toCurrency,
    rate,
    timestamp: new Date(),
  };
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  } catch {
    // Fallback for unsupported currencies
    return `${currency.symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  }
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};