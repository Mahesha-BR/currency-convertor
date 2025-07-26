import React from 'react';
import { Clock, Copy, Trash2 } from 'lucide-react';
import { ConversionHistory as ConversionHistoryType } from '../types/currency';
import { formatCurrency, copyToClipboard } from '../utils/currencyUtils';

interface ConversionHistoryProps {
  history: ConversionHistoryType[];
  onClear: () => void;
}

export const ConversionHistory: React.FC<ConversionHistoryProps> = ({ history, onClear }) => {
  const handleCopy = async (item: ConversionHistoryType) => {
    const textToCopy = `${formatCurrency(item.conversion.fromAmount, item.conversion.fromCurrency)} = ${formatCurrency(item.conversion.toAmount, item.conversion.toCurrency)}`;
    await copyToClipboard(textToCopy);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock size={48} className="mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium mb-1">No Conversions Yet</p>
        <p className="text-sm">Your conversion history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Conversions</h3>
        <button
          onClick={onClear}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 size={14} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.conversion.fromCurrency.flag}</span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(item.conversion.fromAmount, item.conversion.fromCurrency)}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">→</div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.conversion.toCurrency.flag}</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(item.conversion.toAmount, item.conversion.toCurrency)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Rate: 1 {item.conversion.fromCurrency.code} = {item.conversion.rate.toFixed(4)} {item.conversion.toCurrency.code}
                </span>
                <span>{item.timestamp.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={() => handleCopy(item)}
              className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy conversion"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};