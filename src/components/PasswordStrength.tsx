import React from 'react';
import { PasswordStrength as PasswordStrengthType } from '../types/password';

interface PasswordStrengthProps {
  strength: PasswordStrengthType;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">Password Strength</span>
        <span 
          className="font-semibold px-2 py-1 rounded text-xs"
          style={{ 
            color: strength.color,
            backgroundColor: `${strength.color}20`,
          }}
        >
          {strength.label}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Weak</span>
        <span>Strong</span>
      </div>
    </div>
  );
};