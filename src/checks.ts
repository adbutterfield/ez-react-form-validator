import { ValidatorFn, FormState, Field, ErrorTypes } from '../types';

export const checkIfFieldIsValid = <T, K extends keyof T>(validationRules: ValidatorFn<T, K>[], value: T[K]): { hasError: boolean, errors: ErrorTypes[] } => {
  let hasError = false;
  const errors: ErrorTypes[] = [];
  validationRules.forEach((validation) => {
    // validation function should return true if valid
    const { type, isValid } = validation(value);
    if (!isValid) {
      hasError = true;
      errors.push(type);
    }
  });
  return { hasError, errors };
};

export const checkIfAllFieldsAreValid = <T>(formState: FormState<T>): boolean => {
  const { fields, values, validationRules } = formState;
  const errors = {} as {[K in keyof T]: boolean};

  Object.keys(fields).forEach((name) => {
    const value = values[name as keyof T];
    const { hasError } = checkIfFieldIsValid<T, keyof T>(validationRules[name as keyof T], value as T[keyof T]);
    errors[name as keyof T] = hasError;
  });

  return Object.entries(errors).every(([name, value]) => !value);
};

export const checkIfFormIsValid = <T>(formState: FormState<T>): boolean => {
  const { fields } = formState;

  const isValid = Object.values<Field>(fields).every((field) => {
    if (field.isRequired) {
      return !field.hasError && field.dirty;
    }
    return !field.hasError;
  });

  return isValid;
};
