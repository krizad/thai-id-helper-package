import { describe, it, expect } from 'vitest';
import { 
  validateThaiID, 
  formatThaiID, 
  maskThaiID, 
  generateMockThaiID, 
  extractThaiIDInfo 
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
    });

    it('should return false for invalid check digit', () => {
      // 1100100123456 is likely invalid mathematically (just a dummy sequence)
      // We can generate a valid one and change the last digit
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
  });

  describe('formatThaiID', () => {
    it('should format a 13-digit string correctly', () => {
      expect(formatThaiID('1234567890123')).toBe('1-2345-67890-12-3');
    });

    it('should return the original string if length is not 13', () => {
      expect(formatThaiID('12345')).toBe('12345');
    });
  });

  describe('maskThaiID', () => {
    it('should mask a 13-digit string correctly for PDPA', () => {
      expect(maskThaiID('1234567890123')).toBe('1-2345-XXXXX-XX-3');
    });

    it('should return the original string if length is not 13', () => {
      expect(maskThaiID('12345')).toBe('12345');
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
  });

  describe('extractThaiIDInfo', () => {
    it('should extract info correctly for a valid ID format', () => {
      // Create a mock ID starting with 1
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

    it('should return an empty object with isValid=false for invalid length', () => {
      const info = extractThaiIDInfo('123');
      expect(info.isValid).toBe(false);
      expect(info.personType).toBe('Unknown');
      expect(info.provinceCode).toBe('');
    });
  });

});
