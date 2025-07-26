export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
  excludeSimilar: boolean;
}

export interface GeneratedPassword {
  id: string;
  password: string;
  strength: PasswordStrength;
  timestamp: Date;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  percentage: number;
}