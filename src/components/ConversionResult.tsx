import React, { useState } from 'react';
import { Copy, Check, TrendingUp } from 'lucide-react';
import { ConversionResult as ConversionResultType } from '../types/currency';
import { formatCurrency, formatNumber, copyToClipboard } from '../utils/currencyUtils';

interface ConversionResultProps {
  result: ConversionResultType | null;
  loading: boolean;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({ result, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    
    const textToCopy = `${formatCurrency(result.fromAmount, result.fromCurrency)} = ${formatCurrency(result.toAmount, result.toCurrency)}`;
    const success = await copyToClipboard(textToCopy);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 font-medium">Converting...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">Ready to Convert</p>
          <p className="text-sm">Enter an amount to see the conversion result</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Conversion Result</h3>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all duration-200 ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Copy result"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{result.fromCurrency.flag}</span>
              <span className="text-lg font-medium text-gray-700">
                {formatCurrency(result.fromAmount, result.fromCurrency)}
              </span>
            </div>
            <div className="text-gray-400">=</div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{result.toCurrency.flag}</span>
              <span className="text-2xl font-bold text-green-700">
                {formatCurrency(result.toAmount, result.toCurrency)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-green-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Exchange Rate</span>
              <span className="font-medium">
                1 {result.fromCurrency.code} = {formatNumber(result.rate)} {result.toCurrency.code}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Last Updated</span>
              <span>{result.timestamp.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};