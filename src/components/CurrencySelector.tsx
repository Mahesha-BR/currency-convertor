import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Currency } from '../types/currency';
import { currencies, popularCurrencies } from '../data/currencies';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  label: string;
  disabled?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularCurrencyList = currencies.filter(currency =>
    popularCurrencies.includes(currency.code)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleCurrencySelect = (currency: Currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-4 bg-white border-2 rounded-lg transition-all duration-200 ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : isOpen
            ? 'border-blue-400 shadow-md'
            : 'border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:outline-none'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedCurrency.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-900">{selectedCurrency.code}</div>
            <div className="text-sm text-gray-500 truncate">{selectedCurrency.name}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {!searchTerm && (
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Popular Currencies
                </h3>
                <div className="space-y-1">
                  {popularCurrencyList.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency)}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <span className="text-xl">{currency.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{currency.code}</div>
                        <div className="text-sm text-gray-500">{currency.name}</div>
                      </div>
                      <div className="text-sm text-gray-400">{currency.symbol}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {searchTerm ? 'Search Results' : 'All Currencies'}
              </h3>
              <div className="space-y-1">
                {filteredCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency)}
                    className={`w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors ${
                      selectedCurrency.code === currency.code ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{currency.code}</div>
                      <div className="text-sm text-gray-500">{currency.name}</div>
                    </div>
                    <div className="text-sm text-gray-400">{currency.symbol}</div>
                  </button>
                ))}
              </div>
              
              {filteredCurrencies.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No currencies found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};