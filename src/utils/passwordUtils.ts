import { PasswordOptions, PasswordStrength } from '../types/password';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

export const generatePassword = (options: PasswordOptions): string => {
  let charset = '';
  let password = '';

  // Build charset based on options
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSpecialChars) charset += SPECIAL_CHARS;

  // Remove similar characters if requested
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }

  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }

  // Ensure at least one character from each selected type
  const requiredChars: string[] = [];
  if (options.includeUppercase) {
    const chars = options.excludeSimilar 
      ? UPPERCASE.split('').filter(char => !SIMILAR_CHARS.includes(char))
      : UPPERCASE.split('');
    requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeLowercase) {
    const chars = options.excludeSimilar 
      ? LOWERCASE.split('').filter(char => !SIMILAR_CHARS.includes(char))
      : LOWERCASE.split('');
    requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeNumbers) {
    const chars = options.excludeSimilar 
      ? NUMBERS.split('').filter(char => !SIMILAR_CHARS.includes(char))
      : NUMBERS.split('');
    requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeSpecialChars) {
    requiredChars.push(SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)]);
  }

  // Add required characters first
  password += requiredChars.join('');

  // Fill remaining length with random characters
  for (let i = password.length; i < options.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    specialChars: /[^A-Za-z0-9]/.test(password),
    longLength: password.length >= 12,
    veryLongLength: password.length >= 16,
  };

  // Length scoring
  if (checks.length) score += 1;
  if (checks.longLength) score += 1;
  if (checks.veryLongLength) score += 1;

  // Character variety scoring
  if (checks.lowercase) score += 1;
  if (checks.uppercase) score += 1;
  if (checks.numbers) score += 1;
  if (checks.specialChars) score += 2;

  // Normalize score to 0-4 range
  const normalizedScore = Math.min(4, Math.floor(score * 4 / 8));

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#059669'];

  return {
    score: normalizedScore,
    label: strengthLabels[normalizedScore],
    color: strengthColors[normalizedScore],
    percentage: (normalizedScore / 4) * 100,
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};