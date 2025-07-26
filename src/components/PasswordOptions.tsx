import React from 'react';
import { PasswordOptions } from '../types/password';

interface PasswordOptionsProps {
  options: PasswordOptions;
  onChange: (options: PasswordOptions) => void;
}

export const PasswordOptionsComponent: React.FC<PasswordOptionsProps> = ({ 
  options, 
  onChange 
}) => {
  const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
    onChange({ ...options, [key]: value });
  };

  const toggleOptions = [
    { key: 'includeUppercase' as const, label: 'Uppercase Letters (A-Z)', example: 'ABC' },
    { key: 'includeLowercase' as const, label: 'Lowercase Letters (a-z)', example: 'abc' },
    { key: 'includeNumbers' as const, label: 'Numbers (0-9)', example: '123' },
    { key: 'includeSpecialChars' as const, label: 'Special Characters', example: '!@#' },
    { key: 'excludeSimilar' as const, label: 'Exclude Similar Characters', example: 'il1Lo0O' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Length: {options.length} characters
          </label>
          <div className="relative">
            <input
              type="range"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>64</span>
              <span>128</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {toggleOptions.map(({ key, label, example }) => (
            <label
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-xs text-gray-500 ml-2 font-mono">({example})</span>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  checked={options[key] as boolean}
                  onChange={(e) => handleOptionChange(key, e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    options[key] ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      options[key] ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSpecialChars && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            ⚠️ Please select at least one character type to generate a password.
          </p>
        </div>
      )}
    </div>
  );
};