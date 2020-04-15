import {
  validateGreaterThanOrEqualToMin,
  validateLessThanOrEqualToMax,
  validateLengthIsGreaterThanOrEqualToMin,
  validateLengthIsLessThanOrEqualToMax,
  validateIsRequired,
  validatePattern,
} from './validators';

type TestValues = {
  testString: string;
  testBool: boolean;
  testNull: null;
  testNumber: number;
  testUndefined: undefined;
};

describe('validators', () => {
  describe('validateLengthIsGreaterThanOrEqualToMin', () => {
    it('returns a function', () => {
      expect(validateLengthIsGreaterThanOrEqualToMin(5)).toBeInstanceOf(Function);
    });

    it('returns false if the length of the value passed is less than the min length', () => {
      const minLength = 10;
      const testString = 'too short';
      expect(testString.length).toBeLessThan(minLength);

      const validatorFn = validateLengthIsGreaterThanOrEqualToMin(minLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'minLength',
        isValid: false,
      });
    });

    it('returns false if the value passed is not a string', () => {
      const minLength = 10;
      const testString = 0;

      const validatorFn = validateLengthIsGreaterThanOrEqualToMin(minLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'minLength',
        isValid: false,
      });
    });

    it('returns true if the length of the value passed is greater than the min length', () => {
      const minLength = 10;
      const testString = 'long enough';
      expect(testString.length).toBeGreaterThan(minLength);

      const validatorFn = validateLengthIsGreaterThanOrEqualToMin(minLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'minLength',
        isValid: true,
      });
    });

    it('returns true if the length of the value passed is equal to the min length', () => {
      const minLength = 10;
      const testString = 'just right';
      expect(testString.length).toBe(minLength);

      const validatorFn = validateLengthIsGreaterThanOrEqualToMin(minLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'minLength',
        isValid: true,
      });
    });
  });

  describe('validateLengthIsLessThanOrEqualToMax', () => {
    it('returns a function', () => {
      expect(validateLengthIsLessThanOrEqualToMax(5)).toBeInstanceOf(Function);
    });

    it('returns false if the length of the value passed is greater than the max length', () => {
      const maxLength = 7;
      const testString = 'too long';
      expect(testString.length).toBeGreaterThan(maxLength);

      const validatorFn = validateLengthIsLessThanOrEqualToMax(maxLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'maxLength',
        isValid: false,
      });
    });

    it('returns false if the value passed is not a string', () => {
      const maxLength = 7;
      const testString = 0;

      const validatorFn = validateLengthIsLessThanOrEqualToMax(maxLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'maxLength',
        isValid: false,
      });
    });

    it('returns true if the length of the value passed is less than the max length', () => {
      const maxLength = 3;
      const testString = 'ok';
      expect(testString.length).toBeLessThan(maxLength);

      const validatorFn = validateLengthIsLessThanOrEqualToMax(maxLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'maxLength',
        isValid: true,
      });
    });

    it('returns true if the length of the value passed is equal to the max length', () => {
      const maxLength = 10;
      const testString = 'just right';
      expect(testString.length).toBe(maxLength);

      const validatorFn = validateLengthIsLessThanOrEqualToMax(maxLength);
      const result = validatorFn<TestValues>(testString);

      expect(result).toEqual({
        type: 'maxLength',
        isValid: true,
      });
    });
  });

  describe('validateGreaterThanOrEqualToMin', () => {
    it('returns a function', () => {
      expect(validateGreaterThanOrEqualToMin(5)).toBeInstanceOf(Function);
    });

    it('returns false if the value passed is less than the min', () => {
      const min = 7;
      const testValue = 6;
      expect(testValue).toBeLessThan(min);

      const validatorFn = validateGreaterThanOrEqualToMin(min);
      const result = validatorFn<TestValues>(testValue);

      expect(result).toEqual({
        type: 'min',
        isValid: false,
      });
    });

    it('returns true if the value passed is greater than the min', () => {
      const min = 3;
      const testValue = 4;
      expect(testValue).toBeGreaterThan(min);

      const validatorFn = validateGreaterThanOrEqualToMin(min);
      const result = validatorFn<TestValues>(testValue);

      expect(result).toEqual({
        type: 'min',
        isValid: true,
      });
    });

    it('returns true if the value passed is equal to the min', () => {
      const min = 10;
      const testValue = 10;
      expect(testValue).toBe(min);

      const validatorFn = validateGreaterThanOrEqualToMin(min);
      const result = validatorFn<TestValues>(testValue);

      expect(result).toEqual({
        type: 'min',
        isValid: true,
      });
    });
  });

  describe('validateLessThanOrEqualToMax', () => {
    it('returns a function', () => {
      expect(validateLessThanOrEqualToMax(5)).toBeInstanceOf(Function);
    });

    it('returns false if the value passed is more than the max', () => {
      const max = 7;
      const testValue = 8;
      expect(testValue).toBeGreaterThan(max);

      const validatorFn = validateLessThanOrEqualToMax(max);
      const result = validatorFn<TestValues>(testValue);

      expect(result).toEqual({
        type: 'max',
        isValid: false,
      });
    });

    it('returns true if the value passed is less than the max', () => {
      const max = 5;
      const testValue = 4;
      expect(testValue).toBeLessThan(max);

      const validatorFn = validateLessThanOrEqualToMax(max);
      const result = validatorFn<TestValues>(testValue);

      expect(result).toEqual({
        type: 'max',
        isValid: true,
      });
    });

    it('returns true if the value passed is equal to the max', () => {
      const max = 10;
      const testValue = 10;
      expect(testValue).toBe(max);

      const validatorFn = validateLessThanOrEqualToMax(max);
      const result = validatorFn<TestValues>(testValue);

      expect(result).toEqual({
        type: 'max',
        isValid: true,
      });
    });
  });

  describe('validateIsRequired', () => {
    it('returns false on empty string', () => {
      expect(validateIsRequired<TestValues>('')).toEqual({
        type: 'required',
        isValid: false,
      });
    });

    it('returns false on null', () => {
      expect(validateIsRequired<TestValues>(null)).toEqual({
        type: 'required',
        isValid: false,
      });
    });

    it('returns false on undefined', () => {
      expect(validateIsRequired<TestValues>(undefined)).toEqual({
        type: 'required',
        isValid: false,
      });
    });

    it('returns true on a valid string', () => {
      expect(validateIsRequired<TestValues>('valid')).toEqual({
        type: 'required',
        isValid: true,
      });
    });

    it('returns true on a number', () => {
      expect(validateIsRequired<TestValues>(1)).toEqual({
        type: 'required',
        isValid: true,
      });
    });

    it('returns true on zero', () => {
      expect(validateIsRequired<TestValues>(0)).toEqual({
        type: 'required',
        isValid: true,
      });
    });

    it('returns true on booleans', () => {
      expect(validateIsRequired<TestValues>(true)).toEqual({
        type: 'required',
        isValid: true,
      });

      expect(validateIsRequired<TestValues>(false)).toEqual({
        type: 'required',
        isValid: true,
      });
    });
  });

  describe('validatePattern', () => {
    it('returns a function', () => {
      expect(validatePattern(/./)).toBeInstanceOf(Function);
    });

    it("returns false if the value doesn't match the regular expression", () => {
      const validatorFn = validatePattern<TestValues>(/match/);

      expect(validatorFn('no good')).toEqual({
        type: 'pattern',
        isValid: false,
      });
    });

    it('returns true if the value does match the regular expression', () => {
      const validatorFn = validatePattern<TestValues>(/match/);

      expect(validatorFn('match')).toEqual({
        type: 'pattern',
        isValid: true,
      });
    });
  });
});
