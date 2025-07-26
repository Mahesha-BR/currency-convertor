import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { copyToClipboard } from '../utils/passwordUtils';
import { PasswordStrength } from './PasswordStrength';
import { PasswordStrength as PasswordStrengthType } from '../types/password';

interface PasswordDisplayProps {
  password: string;
  strength: PasswordStrengthType;
  onRegenerate: () => void;
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({ 
  password, 
  strength, 
  onRegenerate 
}) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayPassword = showPassword ? password : '•'.repeat(password.length);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 focus-within:border-blue-400 transition-colors">
          <input
            type="text"
            value={displayPassword}
            readOnly
            className="flex-1 bg-transparent font-mono text-lg focus:outline-none select-all text-gray-800"
            onClick={(e) => e.currentTarget.select()}
          />
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            
            <button
              onClick={handleCopy}
              className={`p-2 rounded-md transition-all duration-200 ${
                copied 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>

      <PasswordStrength strength={strength} />

      <div className="flex space-x-3">
        <button
          onClick={onRegenerate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate New Password
        </button>
        
        <button
          onClick={handleCopy}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            copied
              ? 'bg-green-100 text-green-700 focus:ring-green-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};