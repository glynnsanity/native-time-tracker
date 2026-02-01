import {
  isValidEmail,
  validateEmail,
  validatePassword,
  validateLoginPassword,
  isValidActivityName,
  validateActivityName,
} from '../../src/utils/validation';

describe('Email Validation', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user domain.com')).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidEmail('  user@example.com  ')).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should return isValid: true for valid emails', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error for empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return error for invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });
  });
});

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should pass for valid passwords', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.hasMinLength).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
    });

    it('should fail for short passwords', () => {
      const result = validatePassword('Pa1');
      expect(result.isValid).toBe(false);
      expect(result.hasMinLength).toBe(false);
    });

    it('should fail for passwords without uppercase', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.hasUppercase).toBe(false);
    });

    it('should fail for passwords without lowercase', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.hasLowercase).toBe(false);
    });

    it('should fail for passwords without numbers', () => {
      const result = validatePassword('PasswordABC');
      expect(result.isValid).toBe(false);
      expect(result.hasNumber).toBe(false);
    });

    it('should return descriptive error message', () => {
      const result = validatePassword('short');
      expect(result.error).toContain('at least 8 characters');
      expect(result.error).toContain('an uppercase letter');
      expect(result.error).toContain('a number');
    });
  });

  describe('validateLoginPassword', () => {
    it('should pass for non-empty passwords', () => {
      const result = validateLoginPassword('anypassword');
      expect(result.isValid).toBe(true);
    });

    it('should fail for empty passwords', () => {
      const result = validateLoginPassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });
  });
});

describe('Activity Name Validation', () => {
  describe('isValidActivityName', () => {
    it('should return true for valid names', () => {
      expect(isValidActivityName('Work')).toBe(true);
      expect(isValidActivityName('Study Session')).toBe(true);
      expect(isValidActivityName('Reading books')).toBe(true);
    });

    it('should return false for empty names', () => {
      expect(isValidActivityName('')).toBe(false);
      expect(isValidActivityName('   ')).toBe(false);
    });

    it('should return false for names longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(isValidActivityName(longName)).toBe(false);
    });

    it('should return true for names exactly 50 characters', () => {
      const name50 = 'a'.repeat(50);
      expect(isValidActivityName(name50)).toBe(true);
    });
  });

  describe('validateActivityName', () => {
    it('should return error for empty name', () => {
      const result = validateActivityName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Activity name is required');
    });

    it('should return error for too long name', () => {
      const result = validateActivityName('a'.repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Activity name must be 50 characters or less');
    });

    it('should pass for valid names', () => {
      const result = validateActivityName('Valid Activity');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
