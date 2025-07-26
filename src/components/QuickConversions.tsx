import React from 'react';
import { Currency } from '../types/currency';
import { formatCurrency } from '../utils/currencyUtils';

interface QuickConversionsProps {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
}

export const QuickConversions: React.FC<QuickConversionsProps> = ({
  fromCurrency,
  toCurrency,
  rate,
}) => {
  const quickAmounts = [1, 5, 10, 25, 50, 100, 500, 1000];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Conversions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickAmounts.map((amount) => (
          <div
            key={amount}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">{fromCurrency.flag}</span>
              <span className="font-medium text-gray-700">
                {formatCurrency(amount, fromCurrency)}
              </span>
            </div>
            <div className="text-gray-400 text-xs">=</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{toCurrency.flag}</span>
              <span className="font-semibold text-green-600 text-sm">
                {formatCurrency(amount * rate, toCurrency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};