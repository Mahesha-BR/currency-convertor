import React, { useState, useCallback } from 'react';
import { Shield, Settings, History } from 'lucide-react';
import { PasswordOptions, GeneratedPassword } from '../types/password';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordUtils';
import { PasswordDisplay } from './PasswordDisplay';
import { PasswordOptionsComponent } from './PasswordOptions';
import { PasswordHistory } from './PasswordHistory';

export const PasswordGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'options' | 'history'>('generate');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordHistory, setPasswordHistory] = useState<GeneratedPassword[]>([]);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    excludeSimilar: false,
  });

  const generateNewPassword = useCallback(() => {
    try {
      const newPassword = generatePassword(options);
      const strength = calculatePasswordStrength(newPassword);
      
      setCurrentPassword(newPassword);
      
      const passwordEntry: GeneratedPassword = {
        id: Date.now().toString(),
        password: newPassword,
        strength,
        timestamp: new Date(),
      };
      
      setPasswordHistory(prev => [passwordEntry, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  }, [options]);

  const clearHistory = () => {
    setPasswordHistory([]);
  };

  const currentStrength = currentPassword 
    ? calculatePasswordStrength(currentPassword)
    : { score: 0, label: 'N/A', color: '#9CA3AF', percentage: 0 };

  // Generate initial password
  React.useEffect(() => {
    generateNewPassword();
  }, []);

  const tabs = [
    { id: 'generate' as const, label: 'Generate', icon: Shield },
    { id: 'options' as const, label: 'Options', icon: Settings },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Password Generator</h1>
        </div>
        <p className="text-blue-100">Create strong, secure passwords to protect your accounts</p>
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
        {activeTab === 'generate' && (
          <PasswordDisplay
            password={currentPassword}
            strength={currentStrength}
            onRegenerate={generateNewPassword}
          />
        )}

        {activeTab === 'options' && (
          <PasswordOptionsComponent
            options={options}
            onChange={setOptions}
          />
        )}

        {activeTab === 'history' && (
          <PasswordHistory
            passwords={passwordHistory}
            onClear={clearHistory}
          />
        )}
      </div>
    </div>
  );
};