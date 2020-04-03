// @ts-nocheck
import {
  checkIfFieldIsValid,
  checkIfAllFieldsAreValid,
  checkIfFormIsValid,
} from './checks';
import {
  validateGreaterThanOrEqualToMin,
  validateIsRequired,
  validateLengthIsGreaterThanOrEqualToMin,
  validatePattern,
  validateLessThanOrEqualToMax,
} from './validators';
import { FormState } from '../types';

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

type TestValues = {
  testString: string;
  testArray: any[];
  testObject: { [key: string]: any };
  testBool: boolean;
  testNull: null;
  testNumber: number;
  testUndefined: undefined;
};

describe('checks', () => {
  describe('checkIfFieldIsValid', () => {
    it('returns false if the field does not pass single validation', () => {
      const validationRules = [validateGreaterThanOrEqualToMin(10)];

      expect(checkIfFieldIsValid(validationRules, 0)).toEqual({
        errors: ['min'],
        hasError: true,
      });
    });

    it('returns false if the field does not pass multiple validations', () => {
      const validationRules = [
        validateIsRequired,
        validateLengthIsGreaterThanOrEqualToMin(1),
        validatePattern(/\d{2}/),
      ];

      expect(checkIfFieldIsValid(validationRules, '')).toEqual({
        errors: ['required', 'minLength', 'pattern'],
        hasError: true,
      });
    });

    it('returns true if the field does not passes single validation', () => {
      const validationRules = [validateLengthIsGreaterThanOrEqualToMin(1)];

      expect(checkIfFieldIsValid(validationRules, 'ok')).toEqual({
        errors: [],
        hasError: false,
      });
    });

    it('returns true if the field passes multiple validations', () => {
      const validationRules = [
        validateIsRequired,
        validateLengthIsGreaterThanOrEqualToMin(1),
        validatePattern(/\d{2}/),
      ];

      expect(checkIfFieldIsValid(validationRules, '11')).toEqual({
        errors: [],
        hasError: false,
      });
    });
  });

  describe('checkIfAllFieldsAreValid', () => {
    it('returns a formState with isValid false if all fields do not pass validations', () => {
      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: '',
          testBool: null,
          testNumber: 10,
        },
        fields: testFields,
        validationRules: {
          testString: [
            validateIsRequired,
            validateLengthIsGreaterThanOrEqualToMin(2),
          ],
          testBool: [validateIsRequired],
          testNumber: [validateIsRequired, validateLessThanOrEqualToMax(5)],
        },
        isValid: false,
        errorMessages: testErrorMessages,
      };

      expect(checkIfAllFieldsAreValid(formStateWithInvalidFields))
        .toMatchInlineSnapshot(`
        Object {
          "errorMessages": Object {
            "max": "This field exceeds the max value",
            "maxLength": "This field exceeds the max length",
            "min": "This field does not exceed the min value",
            "minLength": "This field does not exceed the min length",
            "pattern": "This field is does not match the correct pattern",
            "required": "This field is required",
          },
          "fields": Object {
            "testBool": Object {
              "dirty": true,
              "errors": Array [
                "required",
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
                "max",
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
                "required",
                "minLength",
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
            "testBool": null,
            "testNumber": 10,
            "testString": "",
          },
        }
      `);
    });

    it('returns a formState with isValid true if all fields pass validations', () => {
      const formStateWithValidFields: FormState<TestValues> = {
        values: {
          testString: 'ok',
          testBool: true,
          testNumber: 5,
        },
        fields: testFields,
        validationRules: {
          testString: [
            validateIsRequired,
            validateLengthIsGreaterThanOrEqualToMin(2),
          ],
          testBool: [validateIsRequired],
          testNumber: [validateIsRequired, validateLessThanOrEqualToMax(5)],
        },
        isValid: false,
        errorMessages: testErrorMessages,
      };

      expect(checkIfAllFieldsAreValid(formStateWithValidFields))
        .toMatchInlineSnapshot(`
        Object {
          "errorMessages": Object {
            "max": "This field exceeds the max value",
            "maxLength": "This field exceeds the max length",
            "min": "This field does not exceed the min value",
            "minLength": "This field does not exceed the min length",
            "pattern": "This field is does not match the correct pattern",
            "required": "This field is required",
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
      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: '',
          testBool: null,
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
            validateIsRequired,
            validateLengthIsGreaterThanOrEqualToMin(2),
          ],
          testBool: [],
          testNumber: [validateIsRequired, validateLessThanOrEqualToMax(5)],
        },
        isValid: false,
        errorMessages: testErrorMessages,
      };

      expect(checkIfFormIsValid(formStateWithInvalidFields)).toEqual(false);
    });

    it("returns false if fields have required fields aren't also dirty", () => {
      const formStateWithInvalidFields: FormState<TestValues> = {
        values: {
          testString: '',
          testBool: null,
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
        errorMessages: testErrorMessages,
      };

      expect(checkIfFormIsValid(formStateWithInvalidFields)).toEqual(false);
    });

    it('returns true if fields are valid', () => {
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
            validateIsRequired,
            validateLengthIsGreaterThanOrEqualToMin(2),
          ],
          testBool: [],
          testNumber: [validateIsRequired, validateLessThanOrEqualToMax(5)],
        },
        isValid: false,
        errorMessages: testErrorMessages,
      };

      expect(checkIfFormIsValid(formStateWithInvalidFields)).toEqual(true);
    });
  });
});
