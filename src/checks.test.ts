import { checkIfFieldIsValid, checkIfAllFieldsAreValid, checkIfFormIsValid } from './checks';
import { validateGreaterThanOrEqualToMin, validateIsRequired, validateLengthIsGreaterThanOrEqualToMin, validatePattern, validateLessThanOrEqualToMax } from './validators';
import { FormState } from './types';

const testFields = {
  testString: {
    touched: true,
    dirty: true,
    hasError: false,
    showError: false,
    isRequired: true,
    isValid: true,
    errors: [],
  },
  testBool: {
    touched: true,
    dirty: true,
    hasError: false,
    showError: false,
    isRequired: true,
    isValid: true,
    errors: [],
  },
  testNumber: {
    touched: true,
    dirty: true,
    hasError: false,
    showError: false,
    isRequired: true,
    isValid: true,
    errors: [],
  },
};

const testErrorMessages = {
  required: 'This field is required',
  pattern: 'This field is does not match the correct pattern',
  min: 'This field does not exceed the min value',
  max: 'This field exceeds the max value',
  minLength: 'This field does not exceed the min length',
  maxLength: 'This field exceeds the max length',
};

describe('checks', () => {
  describe('checkIfFieldIsValid', () => {
    it('returns false if the field does not pass single validation', () => {
      type TestValues = {
        testNumber: number;
      };

      const validationRules = [(value: number | '' | null): { type: 'min'; isValid: boolean } => validateGreaterThanOrEqualToMin(10)<TestValues>(value)];

      expect(checkIfFieldIsValid<TestValues, keyof TestValues>(validationRules, 0)).toEqual({
        errors: ['min'],
        hasError: true,
      });
    });

    it('returns false if the field does not pass multiple validations', () => {
      type TestValues = {
        testString: string;
      };

      const validationRules = [
        (value: string | null): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
        (value: string | null): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(1)<TestValues>(value),
        (value: string | null): { type: 'pattern'; isValid: boolean } => validatePattern<TestValues>(/\d{2}/)(value),
      ];

      expect(checkIfFieldIsValid<TestValues, keyof TestValues>(validationRules, '')).toEqual({
        errors: ['required', 'minLength', 'pattern'],
        hasError: true,
      });
    });

    it('returns true if the field does not passes single validation', () => {
      type TestValues = {
        testString: string;
      };

      const validationRules = [(value: string | null): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(1)<TestValues>(value)];

      expect(checkIfFieldIsValid<TestValues, keyof TestValues>(validationRules, 'ok')).toEqual({
        errors: [],
        hasError: false,
      });
    });

    it('returns true if the field passes multiple validations', () => {
      type TestValues = {
        testString: string;
      };

      const validationRules = [
        (value: string | null): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
        (value: string | null): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(1)<TestValues>(value),
        (value: string | null): { type: 'pattern'; isValid: boolean } => validatePattern<TestValues>(/\d{2}/)(value),
      ];

      expect(checkIfFieldIsValid<TestValues, keyof TestValues>(validationRules, '11')).toEqual({
        errors: [],
        hasError: false,
      });
    });
  });

  describe('checkIfAllFieldsAreValid', () => {
    it('returns a formState with isValid false if all fields do not pass validations', () => {
      type TestValues = {
        testString: string;
        testBool: boolean;
        testNumber: number;
      };

      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: '',
          testBool: '',
          testNumber: 10,
        },
        fields: testFields,
        validationRules: {
          testString: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(2)<TestValues>(value),
          ],
          testBool: [(value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value)],
          testNumber: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'max'; isValid: boolean } => validateLessThanOrEqualToMax(5)<TestValues>(value),
          ],
        },
        isValid: false,
        errorMessages: {
          testString: testErrorMessages,
          testBool: testErrorMessages,
          testNumber: testErrorMessages,
        },
      };

      expect(checkIfAllFieldsAreValid(formStateWithInvalidFields)).toMatchInlineSnapshot(`
        Object {
          "errorMessages": Object {
            "testBool": Object {
              "max": "This field exceeds the max value",
              "maxLength": "This field exceeds the max length",
              "min": "This field does not exceed the min value",
              "minLength": "This field does not exceed the min length",
              "pattern": "This field is does not match the correct pattern",
              "required": "This field is required",
            },
            "testNumber": Object {
              "max": "This field exceeds the max value",
              "maxLength": "This field exceeds the max length",
              "min": "This field does not exceed the min value",
              "minLength": "This field does not exceed the min length",
              "pattern": "This field is does not match the correct pattern",
              "required": "This field is required",
            },
            "testString": Object {
              "max": "This field exceeds the max value",
              "maxLength": "This field exceeds the max length",
              "min": "This field does not exceed the min value",
              "minLength": "This field does not exceed the min length",
              "pattern": "This field is does not match the correct pattern",
              "required": "This field is required",
            },
          },
          "fields": Object {
            "testBool": Object {
              "dirty": true,
              "errors": Array [
                "This field is required",
              ],
              "hasError": true,
              "isRequired": true,
              "isValid": true,
              "showError": true,
              "touched": true,
            },
            "testNumber": Object {
              "dirty": true,
              "errors": Array [
                "This field exceeds the max value",
              ],
              "hasError": true,
              "isRequired": true,
              "isValid": true,
              "showError": true,
              "touched": true,
            },
            "testString": Object {
              "dirty": true,
              "errors": Array [
                "This field is required",
                "This field does not exceed the min length",
              ],
              "hasError": true,
              "isRequired": true,
              "isValid": true,
              "showError": true,
              "touched": true,
            },
          },
          "isValid": false,
          "validationRules": Object {
            "testBool": Array [
              [Function],
            ],
            "testNumber": Array [
              [Function],
              [Function],
            ],
            "testString": Array [
              [Function],
              [Function],
            ],
          },
          "values": Object {
            "testBool": "",
            "testNumber": 10,
            "testString": "",
          },
        }
      `);
    });

    it('returns a formState with isValid true if all fields pass validations', () => {
      type TestValues = {
        testString: string;
        testBool: boolean;
        testNumber: number;
      };

      const formStateWithValidFields: FormState<TestValues> = {
        values: {
          testString: 'ok',
          testBool: true,
          testNumber: 5,
        },
        fields: testFields,
        validationRules: {
          testString: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(2)<TestValues>(value),
          ],
          testBool: [(value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value)],
          testNumber: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'max'; isValid: boolean } => validateLessThanOrEqualToMax(5)<TestValues>(value),
          ],
        },
        isValid: false,
        errorMessages: {
          testString: testErrorMessages,
          testBool: testErrorMessages,
          testNumber: testErrorMessages,
        },
      };

      expect(checkIfAllFieldsAreValid(formStateWithValidFields)).toMatchInlineSnapshot(`
        Object {
          "errorMessages": Object {
            "testBool": Object {
              "max": "This field exceeds the max value",
              "maxLength": "This field exceeds the max length",
              "min": "This field does not exceed the min value",
              "minLength": "This field does not exceed the min length",
              "pattern": "This field is does not match the correct pattern",
              "required": "This field is required",
            },
            "testNumber": Object {
              "max": "This field exceeds the max value",
              "maxLength": "This field exceeds the max length",
              "min": "This field does not exceed the min value",
              "minLength": "This field does not exceed the min length",
              "pattern": "This field is does not match the correct pattern",
              "required": "This field is required",
            },
            "testString": Object {
              "max": "This field exceeds the max value",
              "maxLength": "This field exceeds the max length",
              "min": "This field does not exceed the min value",
              "minLength": "This field does not exceed the min length",
              "pattern": "This field is does not match the correct pattern",
              "required": "This field is required",
            },
          },
          "fields": Object {
            "testBool": Object {
              "dirty": true,
              "errors": Array [],
              "hasError": false,
              "isRequired": true,
              "isValid": true,
              "showError": false,
              "touched": true,
            },
            "testNumber": Object {
              "dirty": true,
              "errors": Array [],
              "hasError": false,
              "isRequired": true,
              "isValid": true,
              "showError": false,
              "touched": true,
            },
            "testString": Object {
              "dirty": true,
              "errors": Array [],
              "hasError": false,
              "isRequired": true,
              "isValid": true,
              "showError": false,
              "touched": true,
            },
          },
          "isValid": true,
          "validationRules": Object {
            "testBool": Array [
              [Function],
            ],
            "testNumber": Array [
              [Function],
              [Function],
            ],
            "testString": Array [
              [Function],
              [Function],
            ],
          },
          "values": Object {
            "testBool": true,
            "testNumber": 5,
            "testString": "ok",
          },
        }
      `);
    });
  });

  describe('checkIfFormIsValid', () => {
    it('returns false if fields have errors', () => {
      type TestValues = {
        testString: string;
        testBool: boolean;
        testNumber: number;
      };

      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: '',
          testBool: true,
          testNumber: 10,
        },
        fields: {
          testNumber: {
            ...testFields.testNumber,
            dirty: false,
          },
          testBool: {
            ...testFields.testBool,
            dirty: false,
            isRequired: false,
          },
          testString: {
            ...testFields.testString,
            dirty: false,
          },
        },
        validationRules: {
          testString: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(2)<TestValues>(value),
          ],
          testBool: [],
          testNumber: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'max'; isValid: boolean } => validateLessThanOrEqualToMax(5)<TestValues>(value),
          ],
        },
        isValid: false,
        errorMessages: {
          testString: testErrorMessages,
          testBool: testErrorMessages,
          testNumber: testErrorMessages,
        },
      };

      expect(checkIfFormIsValid(formStateWithInvalidFields)).toEqual(false);
    });

    it("returns false if fields have required fields aren't also dirty", () => {
      type TestValues = {
        testString: string;
        testBool: boolean;
        testNumber: number;
      };

      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: '',
          testBool: true,
          testNumber: 10,
        },
        fields: {
          testNumber: {
            ...testFields.testNumber,
            dirty: false,
          },
          testBool: {
            ...testFields.testBool,
            dirty: false,
          },
          testString: {
            ...testFields.testString,
            dirty: false,
          },
        },
        validationRules: {
          testString: [],
          testBool: [],
          testNumber: [],
        },
        isValid: false,
        errorMessages: {
          testString: testErrorMessages,
          testBool: testErrorMessages,
          testNumber: testErrorMessages,
        },
      };

      expect(checkIfFormIsValid(formStateWithInvalidFields)).toEqual(false);
    });

    it('returns true if fields are valid', () => {
      type TestValues = {
        testString: string;
        testBool: boolean;
        testNumber: number;
      };

      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: 'ok',
          testBool: true,
          testNumber: 5,
        },
        fields: {
          testNumber: {
            ...testFields.testNumber,
          },
          testBool: {
            ...testFields.testBool,
            isRequired: false,
          },
          testString: {
            ...testFields.testString,
          },
        },
        validationRules: {
          testString: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'minLength'; isValid: boolean } => validateLengthIsGreaterThanOrEqualToMin(2)<TestValues>(value),
          ],
          testBool: [],
          testNumber: [
            (value): { type: 'required'; isValid: boolean } => validateIsRequired<TestValues>(value),
            (value): { type: 'max'; isValid: boolean } => validateLessThanOrEqualToMax(5)<TestValues>(value),
          ],
        },
        isValid: false,
        errorMessages: {
          testString: testErrorMessages,
          testBool: testErrorMessages,
          testNumber: testErrorMessages,
        },
      };

      expect(checkIfFormIsValid(formStateWithInvalidFields)).toEqual(true);
    });
  });
});
