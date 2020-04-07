import { ValidatorFn, FormState, Field, ErrorTypes } from '../types';

export const checkIfFieldIsValid = <T, K extends keyof T>(validationRules: ValidatorFn<T, K>[], value: T[K] | null | ''): { hasError: boolean, errors: ErrorTypes[] } => {
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

export const checkIfAllFieldsAreValid = <T>(formState: FormState<T>): FormState<T> => {
  const { fields, values, validationRules } = formState;

  Object.keys(fields).forEach((name) => {
    const value = values[name as keyof T];
    const { hasError, errors } = checkIfFieldIsValid<T, keyof T>(validationRules[name as keyof T], value as T[keyof T] | null | '');
    formState.fields[name as keyof T] = {
      ...formState.fields[name as keyof T],
      hasError,
      errors: hasError ? errors.map((error) => formState.errorMessages[name as keyof T][error]) : [],
      showError: hasError,
      dirty: true,
    };
  });

  formState.isValid = checkIfFormIsValid(formState);

  return formState;
};

export const checkIfFormIsValid = <T>(formState: FormState<T>): boolean => {
  const { fields } = formState;

  return Object.values<Field>(fields).every((field) => {
    if (field.isRequired) {
      // For required fields, also need to check if a value was entered (dirty)
      return !field.hasError && field.dirty;
    }
    return !field.hasError;
  });
};
