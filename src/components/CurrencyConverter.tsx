import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, Calculator, History, Zap } from 'lucide-react';
import { Currency, ConversionResult, ConversionHistory } from '../types/currency';
import { getCurrencyByCode } from '../data/currencies';
import { convertCurrency } from '../utils/currencyUtils';
import { CurrencySelector } from './CurrencySelector';
import { AmountInput } from './AmountInput';
import { ConversionResult as ConversionResultComponent } from './ConversionResult';
import { ConversionHistory as ConversionHistoryComponent } from './ConversionHistory';
import { QuickConversions } from './QuickConversions';

export const CurrencyConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'convert' | 'history' | 'quick'>('convert');
  const [fromCurrency, setFromCurrency] = useState<Currency>(getCurrencyByCode('USD')!);
  const [toCurrency, setToCurrency] = useState<Currency>(getCurrencyByCode('EUR')!);
  const [amount, setAmount] = useState<string>('100');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ConversionHistory[]>([]);

  const performConversion = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    try {
      const conversionResult = await convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      );
      
      setResult(conversionResult);
      
      // Add to history
      const historyItem: ConversionHistory = {
        id: Date.now().toString(),
        conversion: conversionResult,
        timestamp: new Date(),
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20 items
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performConversion();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [performConversion]);

  const tabs = [
    { id: 'convert' as const, label: 'Convert', icon: Calculator },
    { id: 'quick' as const, label: 'Quick', icon: Zap },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Currency Converter</h1>
        </div>
        <p className="text-green-100">Convert between world currencies with real-time exchange rates</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'convert' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <AmountInput
                  amount={amount}
                  currency={fromCurrency}
                  onChange={setAmount}
                  label="Amount"
                />
                <CurrencySelector
                  selectedCurrency={fromCurrency}
                  onCurrencyChange={setFromCurrency}
                  label="From"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-center lg:justify-start">
                  <button
                    onClick={swapCurrencies}
                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Swap currencies"
                  >
                    <ArrowUpDown size={20} />
                  </button>
                </div>
                <CurrencySelector
                  selectedCurrency={toCurrency}
                  onCurrencyChange={setToCurrency}
                  label="To"
                />
              </div>
            </div>

            <ConversionResultComponent result={result} loading={loading} />
          </div>
        )}

        {activeTab === 'quick' && result && (
          <QuickConversions
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            rate={result.rate}
          />
        )}

        {activeTab === 'history' && (
          <ConversionHistoryComponent
            history={history}
            onClear={clearHistory}
          />
        )}
      </div>
    </div>
  );
};