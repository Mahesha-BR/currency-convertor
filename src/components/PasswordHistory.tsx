import React from 'react';
import { Clock, Copy, Trash2 } from 'lucide-react';
import { GeneratedPassword } from '../types/password';
import { copyToClipboard } from '../utils/passwordUtils';

interface PasswordHistoryProps {
  passwords: GeneratedPassword[];
  onClear: () => void;
}

export const PasswordHistory: React.FC<PasswordHistoryProps> = ({ passwords, onClear }) => {
  const handleCopy = async (password: string) => {
    await copyToClipboard(password);
  };

  if (passwords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock size={48} className="mx-auto mb-3 opacity-50" />
        <p className="text-sm">No passwords generated yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Passwords</h3>
        <button
          onClick={onClear}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 size={14} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {passwords.slice(0, 10).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-gray-800 truncate">
                {item.password}
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    color: item.strength.color,
                    backgroundColor: `${item.strength.color}20`,
                  }}
                >
                  {item.strength.label}
                </span>
                <span className="text-xs text-gray-500">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => handleCopy(item.password)}
              className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              title="Copy password"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};