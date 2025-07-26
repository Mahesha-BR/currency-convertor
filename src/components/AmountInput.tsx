import React from 'react';
import { Currency } from '../types/currency';

interface AmountInputProps {
  amount: string;
  currency: Currency;
  onChange: (amount: string) => void;
  label: string;
  disabled?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  currency,
  onChange,
  label,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent multiple decimal points
    if (e.key === '.' && amount.includes('.')) {
      e.preventDefault();
    }
    
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-gray-500 text-lg font-medium">
            {currency.symbol}
          </span>
        </div>
        <input
          type="text"
          value={amount}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="0.00"
          className={`w-full pl-12 pr-4 py-4 text-lg font-semibold border-2 rounded-lg transition-all duration-200 ${
            disabled
              ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-blue-400 focus:outline-none'
          }`}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="text-gray-400 text-sm font-medium">
            {currency.code}
          </span>
        </div>
      </div>
    </div>
  );
};