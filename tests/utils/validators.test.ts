import { describe, it, expect } from 'vitest';
import {
  classifyAqiSeverity,
  validateProfileStep1,
  validateProfileStep2,
  validateProfileStep3,
} from '../../src/utils/validators';

describe('validators utility', () => {
  describe('classifyAqiSeverity', () => {
    it('accurately categorizes AQI levels according to environmental health scales', () => {
      expect(classifyAqiSeverity(35)).toBe('good');
      expect(classifyAqiSeverity(50)).toBe('good');
      expect(classifyAqiSeverity(75)).toBe('moderate');
      expect(classifyAqiSeverity(100)).toBe('moderate');
      expect(classifyAqiSeverity(150)).toBe('poor');
      expect(classifyAqiSeverity(200)).toBe('poor');
      expect(classifyAqiSeverity(250)).toBe('severe');
      expect(classifyAqiSeverity(300)).toBe('severe');
      expect(classifyAqiSeverity(350)).toBe('hazardous');
      expect(classifyAqiSeverity(500)).toBe('hazardous');
    });
  });

  describe('validateProfileStep1', () => {
    it('returns empty error map for valid inputs', () => {
      const errors = validateProfileStep1({
        city: 'Delhi NCR',
        outdoorAqi: 420,
        householdSize: 4,
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('rejects empty or whitespace-only city names', () => {
      expect(
        validateProfileStep1({ city: '   ', outdoorAqi: 100, householdSize: 2 }).city
      ).toBeDefined();
    });

    it('validates city length limits', () => {
      expect(
        validateProfileStep1({ city: 'A', outdoorAqi: 100, householdSize: 2 }).city
      ).toBeDefined();

      expect(
        validateProfileStep1({ city: 'C'.repeat(55), outdoorAqi: 100, householdSize: 2 }).city
      ).toBeDefined();
    });

    it('validates outdoor AQI numerical bounds', () => {
      expect(
        validateProfileStep1({ city: 'Delhi', outdoorAqi: -10, householdSize: 2 }).outdoorAqi
      ).toBeDefined();

      expect(
        validateProfileStep1({ city: 'Delhi', outdoorAqi: 1200, householdSize: 2 }).outdoorAqi
      ).toBeDefined();

      expect(
        validateProfileStep1({ city: 'Delhi', outdoorAqi: NaN, householdSize: 2 }).outdoorAqi
      ).toBeDefined();
    });

    it('validates household size bounds (1-20)', () => {
      expect(
        validateProfileStep1({ city: 'Delhi', outdoorAqi: 100, householdSize: 0 }).householdSize
      ).toBeDefined();

      expect(
        validateProfileStep1({ city: 'Delhi', outdoorAqi: 100, householdSize: 25 }).householdSize
      ).toBeDefined();

      expect(
        validateProfileStep1({ city: 'Delhi', outdoorAqi: 100, householdSize: NaN }).householdSize
      ).toBeDefined();
    });
  });

  describe('validateProfileStep2', () => {
    it('accepts valid dwelling and vulnerability arrays', () => {
      const errors = validateProfileStep2({
        homeType: 'apartment',
        vulnerabilities: ['children', 'asthma_respiratory'],
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('rejects invalid home types', () => {
      const errors = validateProfileStep2({
        // @ts-expect-error Testing invalid enum value
        homeType: 'tent',
        vulnerabilities: [],
      });
      expect(errors.homeType).toBeDefined();
    });

    it('rejects non-array vulnerabilities', () => {
      const errors = validateProfileStep2({
        homeType: 'apartment',
        // @ts-expect-error Testing non-array type
        vulnerabilities: null,
      });
      expect(errors.vulnerabilities).toBeDefined();
    });
  });

  describe('validateProfileStep3', () => {
    it('accepts valid commute, cooking fuel, and gear selections', () => {
      const errors = validateProfileStep3({
        commuteMode: 'public_metro_bus',
        cookingFuel: 'induction_electric',
        cleanAirGear: 'hepaPurifier',
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('flags invalid selections', () => {
      const errors = validateProfileStep3({
        // @ts-expect-error Testing invalid enum values
        commuteMode: 'helicopter',
        // @ts-expect-error Testing invalid enum values
        cookingFuel: 'coal_open',
        // @ts-expect-error Testing invalid enum values
        cleanAirGear: 'magic_wand',
      });
      expect(errors.commuteMode).toBeDefined();
      expect(errors.cookingFuel).toBeDefined();
      expect(errors.cleanAirGear).toBeDefined();
    });
  });
});
