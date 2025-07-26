export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

export interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  timestamp: Date;
}

export interface ConversionHistory {
  id: string;
  conversion: ConversionResult;
  timestamp: Date;
}

export interface ApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}