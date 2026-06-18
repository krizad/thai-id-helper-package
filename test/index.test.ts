import { describe, it, expect } from 'vitest';
import {
  validateThaiID,
  formatThaiID,
  unformatThaiID,
  isFormattedThaiID,
  maskThaiID,
  generateMockThaiID,
  parseThaiID,
  extractThaiIDInfo,
  getProvinceName,
  ThaiIDError,
} from '../src/index';

describe('Thai ID Kit', () => {
  describe('validateThaiID', () => {
    it('should return true for a mathematically valid ID', () => {
      const validId = generateMockThaiID();
      expect(validateThaiID(validId)).toBe(true);
    });

    it('should return false for invalid length', () => {
      expect(validateThaiID('12345')).toBe(false);
      expect(validateThaiID('12345678901234')).toBe(false);
      expect(validateThaiID('')).toBe(false);
    });

    it('should return false for invalid check digit', () => {
      const validId = generateMockThaiID();
      const lastDigit = parseInt(validId.charAt(12));
      const invalidDigit = (lastDigit + 1) % 10;
      const invalidId = validId.substring(0, 12) + invalidDigit;
      expect(validateThaiID(invalidId)).toBe(false);
    });

    it('should ignore dashes when validating', () => {
      const validId = generateMockThaiID();
      const formattedId = formatThaiID(validId);
      expect(validateThaiID(formattedId)).toBe(true);
    });

    it('should return false for non-numeric characters', () => {
      expect(validateThaiID('abcdefghijklm')).toBe(false);
      expect(validateThaiID('1-abc-00123-45-6')).toBe(false);
    });

    it('should return false for whitespace-padded invalid input', () => {
      expect(validateThaiID('  1234567890123  ')).toBe(false);
    });

    it('should return false for null-like edge cases', () => {
      expect(validateThaiID('0000000000000')).toBe(false);
    });
  });

  describe('formatThaiID', () => {
    it('should format a 13-digit string correctly', () => {
      expect(formatThaiID('1234567890123')).toBe('1-2345-67890-12-3');
    });

    it('should return the original string if length is not 13', () => {
      expect(formatThaiID('12345')).toBe('12345');
      expect(formatThaiID('')).toBe('');
    });

    it('should handle input with existing dashes', () => {
      expect(formatThaiID('1-2345-67890-12-3')).toBe('1-2345-67890-12-3');
    });
  });

  describe('unformatThaiID', () => {
    it('should remove dashes from a formatted ID', () => {
      expect(unformatThaiID('1-1001-00123-45-6')).toBe('1100100123456');
    });

    it('should return the same string if no dashes', () => {
      expect(unformatThaiID('1100100123456')).toBe('1100100123456');
    });

    it('should handle empty string', () => {
      expect(unformatThaiID('')).toBe('');
    });
  });

  describe('isFormattedThaiID', () => {
    it('should return true for properly formatted ID', () => {
      expect(isFormattedThaiID('1-2345-67890-12-3')).toBe(true);
    });

    it('should return false for unformatted ID', () => {
      expect(isFormattedThaiID('1234567890123')).toBe(false);
    });

    it('should return false for partially formatted ID', () => {
      expect(isFormattedThaiID('1-2345-67890-12')).toBe(false);
      expect(isFormattedThaiID('12345-67890-12-3')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isFormattedThaiID('')).toBe(false);
    });
  });

  describe('maskThaiID', () => {
    it('should mask a 13-digit string correctly for PDPA', () => {
      expect(maskThaiID('1234567890123')).toBe('1-2345-XXXXX-XX-3');
    });

    it('should return the original string if length is not 13', () => {
      expect(maskThaiID('12345')).toBe('12345');
    });

    it('should mask a formatted ID', () => {
      expect(maskThaiID('1-2345-67890-12-3')).toBe('1-2345-XXXXX-XX-3');
    });
  });

  describe('generateMockThaiID', () => {
    it('should generate a 13-digit string', () => {
      const id = generateMockThaiID();
      expect(id.length).toBe(13);
    });

    it('should generate a mathematically valid ID', () => {
      const id = generateMockThaiID();
      expect(validateThaiID(id)).toBe(true);
    });

    it('should generate with specified first digit', () => {
      const id = generateMockThaiID(5);
      expect(id.charAt(0)).toBe('5');
      expect(validateThaiID(id)).toBe(true);
    });

    it('should throw ThaiIDError for first digit out of range', () => {
      expect(() => generateMockThaiID(0)).toThrow(ThaiIDError);
      expect(() => generateMockThaiID(9)).toThrow(ThaiIDError);
      expect(() => generateMockThaiID(-1)).toThrow(ThaiIDError);
    });

    it('should generate valid IDs with each first digit 1-8', () => {
      for (let d = 1; d <= 8; d++) {
        const id = generateMockThaiID(d);
        expect(id.charAt(0)).toBe(String(d));
        expect(validateThaiID(id)).toBe(true);
      }
    });
  });

  describe('parseThaiID', () => {
    it('should return ThaiID for a valid ID', () => {
      const validId = generateMockThaiID();
      const parsed = parseThaiID(validId);
      expect(parsed).toBe(validId);
    });

    it('should accept formatted ID', () => {
      const validId = generateMockThaiID();
      const formatted = formatThaiID(validId);
      const parsed = parseThaiID(formatted);
      expect(parsed).toBe(validId);
    });

    it('should throw ThaiIDError for an invalid ID', () => {
      expect(() => parseThaiID('12345')).toThrow(ThaiIDError);
      expect(() => parseThaiID('0000000000000')).toThrow(ThaiIDError);
    });

    it('should throw ThaiIDError with the correct error name', () => {
      try {
        parseThaiID('invalid');
      } catch (e) {
        expect(e).toBeInstanceOf(ThaiIDError);
        expect((e as ThaiIDError).name).toBe('ThaiIDError');
      }
    });
  });

  describe('extractThaiIDInfo', () => {
    it('should extract info correctly for a valid ID format', () => {
      let id = '';
      while (id.charAt(0) !== '1') {
        id = generateMockThaiID();
      }

      const info = extractThaiIDInfo(id);
      expect(info.isValid).toBe(true);
      expect(info.personType).toBe('คนที่เกิดและมีสัญชาติเป็นคนไทย และแจ้งเกิดภายในกำหนดเวลา');
      expect(info.provinceCode).toBe(id.substring(1, 3));
      expect(info.districtCode).toBe(id.substring(3, 5));
      expect(info.birthCertificateBookNo).toBe(id.substring(5, 10));
      expect(info.sequenceNo).toBe(id.substring(10, 12));
      expect(info.checkDigit).toBe(id.charAt(12));
    });

    it('should return empty info with isValid=false for invalid length', () => {
      const info = extractThaiIDInfo('123');
      expect(info.isValid).toBe(false);
      expect(info.personType).toBe('Unknown');
      expect(info.provinceCode).toBe('');
      expect(info.provinceName).toBe('');
    });

    it('should include provinceName', () => {
      const id = generateMockThaiID(1);
      const info = extractThaiIDInfo(id);
      if (info.provinceCode in { '10': 1, '11': 1, '12': 1 }) {
        expect(typeof info.provinceName).toBe('string');
        expect(info.provinceName.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getProvinceName', () => {
    it('should return province name for known codes', () => {
      expect(getProvinceName('10')).toBe('กรุงเทพมหานคร');
      expect(getProvinceName('50')).toBe('เชียงใหม่');
      expect(getProvinceName('84')).toBe('สุราษฎร์ธานี');
    });

    it('should return empty string for unknown codes', () => {
      expect(getProvinceName('99')).toBe('');
      expect(getProvinceName('')).toBe('');
      expect(getProvinceName('aa')).toBe('');
    });
  });

  describe('ThaiIDError', () => {
    it('should have correct name property', () => {
      const error = new ThaiIDError('test');
      expect(error.name).toBe('ThaiIDError');
      expect(error.message).toBe('test');
    });

    it('should be an instance of Error', () => {
      const error = new ThaiIDError('test');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ThaiIDError);
    });
  });
});