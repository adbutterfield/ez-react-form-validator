import { useState, useEffect } from 'react';
import {
  validateGreaterThanOrEqualToMin,
  validateLessThanOrEqualToMax,
  validateLengthIsGreaterThanOrEqualToMin,
  validateLengthIsLessThanOrEqualToMax,
  validateIsRequired,
  validatePattern,
} from './validators';
import {
  checkIfFieldIsValid,
  checkIfAllFieldsAreValid,
  checkIfFormIsValid,
} from './checks';
import { ValidatorFn, FormState, ValidatorSetup, Validation, ErrorMessages, ErrorTypes, Field } from '../types';

const cloneFormState = <T>(formState: FormState<T>) => {
  return {
    values: { ...formState.values },
    fields: { ...formState.fields },
    validationRules: { ...formState.validationRules },
    isValid: formState.isValid,
    errorMessages: { ...formState.errorMessages },
  };
};

const defaultFormState = {
  values: {},
  fields: {},
  validationRules: {},
  isValid: false,
  errorMessages: {},
};

const defaultErrors = {
  required: 'This field is required',
  pattern: 'This field is does not match the correct pattern',
  min: 'This field does not exceed the min value',
  max: 'This field exceeds the max value',
  minLength: 'This field does not exceed the min length',
  maxLength: 'This field exceeds the max length',
};

const getErrorMessages = (errors: ErrorTypes[], errorMessages: ErrorMessages): string[] => {
  return errors.map((error) => errorMessages[error]);
};

const useFormValidator = <T>(setup: ValidatorSetup<T>) => {
  const [formState, setFormState] = useState<FormState<T>>(defaultFormState as FormState<T>);
  const [setupComplete, setSetupComplete] = useState(false);
  const [newValues, setNewValues] = useState<{ [K in keyof T]?: T[K] } | null>(null);

  useEffect(() => {
    const newFormState = {
      values: {},
      fields: {},
      validationRules: {},
      isValid: false,
      errorMessages: {},
    } as FormState<T>;

    Object.entries<Validation<T>>(setup).forEach(([name, validations]) => {
      const {
        defaultValue = null,
        errors,
        max,
        maxLength,
        min,
        minLength,
        pattern,
        required,
      } = validations;

      // a field cannot have both max and maxLength or min and minLength
      if ((min || max) && (minLength || maxLength)) {
        throw new Error('A field can only have min/max OR minLength/maxLength validation');
      }

      // setup validator functions
      const validatorFns: ValidatorFn<T, keyof T>[] = [];
      if (required) {
        validatorFns.push(validateIsRequired);
      }
      if (pattern) {
        validatorFns.push(validatePattern(pattern));
      }
      if (min) {
        validatorFns.push(validateGreaterThanOrEqualToMin(min));
      }
      if (max) {
        validatorFns.push(validateLessThanOrEqualToMax(max));
      }
      if (minLength) {
        validatorFns.push(validateLengthIsGreaterThanOrEqualToMin(minLength));
      }
      if (maxLength) {
        validatorFns.push(validateLengthIsLessThanOrEqualToMax(maxLength));
      }

      newFormState.validationRules[name as keyof T] = validatorFns;
      const errorMessages = { ...defaultErrors, ...errors };
      newFormState.errorMessages[name as keyof T] = errorMessages;

      // If there is a default value, then check if field is valid
      let fieldHasError = false;
      let fieldErrors: ErrorTypes[] = [];
      const { hasError, errors: newFieldErrors } = checkIfFieldIsValid(validatorFns, defaultValue);
      fieldHasError = hasError;
      fieldErrors = newFieldErrors;

      // Set isDirty true and set showError to according to the default values
      const isDirty = defaultValue !== null && defaultValue !== '';
      newFormState.values[name as keyof T] = defaultValue;
      newFormState.fields[name as keyof T] = {
        touched: false,
        dirty: isDirty,
        hasError: fieldHasError,
        showError: isDirty && fieldHasError,
        isRequired: Boolean(required),
        isValid: !fieldHasError && isDirty,
        errors: fieldHasError ? getErrorMessages(fieldErrors, errorMessages) : [],
      };
    });

    newFormState.isValid = checkIfFormIsValid<T>(newFormState);
    setFormState(newFormState);
    setSetupComplete(true);
  }, []);

  useEffect(() => {
    if (setupComplete && newValues) {
      const newFormState = cloneFormState(formState);
      Object.entries(newValues).forEach(([name, value]) => {
        // check if field is valid if there is a default value
        const { hasError, errors } = checkIfFieldIsValid(newFormState.validationRules[name as keyof T], value as T[keyof T] | null | '');
        const fieldErrors: string[] = getErrorMessages(errors, newFormState.errorMessages[name as keyof T]);

        newFormState.values[name as keyof T] = value as T[keyof T] | null | '';
        newFormState.fields[name as keyof T] = {
          ...newFormState.fields[name as keyof T],
          dirty: true,
          hasError,
          showError: hasError,
          isValid: !hasError,
          errors: hasError ? fieldErrors : [],
        };
      });
      newFormState.isValid = checkIfAllFieldsAreValid<T>(newFormState);
      setFormState(newFormState);
      setNewValues(null);
    }
  }, [setupComplete, newValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newFormState = cloneFormState(formState);
    const { name, value } = event.target;
    // update value
    newFormState.values[name as keyof T] = value as unknown as T[keyof T] | null | '';
    // check if field has an error
    const { hasError, errors } = checkIfFieldIsValid(newFormState.validationRules[name as keyof T], value as unknown as T[keyof T] | null | '');

    // update touched/dirty/error
    const previousFieldState = newFormState.fields[name as keyof T];
    // first case will show error if there is an error in the default value
    // second case will show error if field has been touched (blurred once)
    const shouldShowError = (previousFieldState.showError || previousFieldState.touched) && hasError;
    const isDirty = previousFieldState.dirty || (value !== '' && value !== null);
    const newFieldState: Field = {
      ...previousFieldState,
      touched: previousFieldState.touched,
      dirty: isDirty,
      isValid: !hasError && isDirty,
      hasError,
      errors: shouldShowError ? getErrorMessages(errors, newFormState.errorMessages[name as keyof T]) : [],
      showError: shouldShowError,
    };

    // set new field state
    newFormState.fields[name as keyof T] = newFieldState;

    // check if form is valid
    newFormState.isValid = checkIfFormIsValid(newFormState);
    setFormState(newFormState);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newFormState = cloneFormState(formState);
    const { name, value } = event.target;
    const { hasError, errors } = checkIfFieldIsValid(newFormState.validationRules[name as keyof T], value as unknown as T[keyof T] | null | '');
    newFormState.fields[name as keyof T] = {
      ...newFormState.fields[name as keyof T],
      showError: hasError,
      touched: true,
      errors: hasError ? getErrorMessages(errors, newFormState.errorMessages[name as keyof T]) : [],
    };
    newFormState.isValid = checkIfFormIsValid(newFormState);
    setFormState(newFormState);
  };

  return {
    fields: { ...formState.fields },
    isValid: formState.isValid,
    values: formState.values,
    handleChange,
    handleBlur,
    setValues: setNewValues,
    setupComplete,
  };
};

export default useFormValidator;
