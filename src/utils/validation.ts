/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordValidation extends ValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates email and returns detailed result
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!isValidEmail(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validates password strength
 * Requirements: min 8 chars, at least one uppercase, one lowercase, one number
 */
export const validatePassword = (password: string): PasswordValidation => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  let error: string | undefined;
  if (!isValid) {
    const missing: string[] = [];
    if (!hasMinLength) missing.push('at least 8 characters');
    if (!hasUppercase) missing.push('an uppercase letter');
    if (!hasLowercase) missing.push('a lowercase letter');
    if (!hasNumber) missing.push('a number');
    error = `Password must contain ${missing.join(', ')}`;
  }

  return {
    isValid,
    error,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
  };
};

/**
 * Simple password validation for login (just checks if not empty)
 */
export const validateLoginPassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  return { isValid: true };
};

/**
 * Validates activity name
 * Requirements: non-empty, max 50 chars
 */
export const isValidActivityName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length > 0 && trimmedName.length <= 50;
};

/**
 * Validates activity name and returns detailed result
 */
export const validateActivityName = (name: string): ValidationResult => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, error: 'Activity name is required' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Activity name must be 50 characters or less' };
  }

  return { isValid: true };
};
