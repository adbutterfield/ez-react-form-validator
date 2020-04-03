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

const defaultErrorMessages = {
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

const getValidationFns = <T>(validations: Validation<T>): ValidatorFn<T, keyof T>[] => {
  const {
    max,
    maxLength,
    min,
    minLength,
    pattern,
    required,
  } = validations;

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

  return validatorFns;
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
        errorMessages,
        max,
        maxLength,
        min,
        minLength,
        required,
      } = validations;

      // A field cannot have both max and maxLength or min and minLength
      if ((min || max) && (minLength || maxLength)) {
        throw new Error('A field can only have min/max OR minLength/maxLength validation');
      }

      // Setup validator functions
      newFormState.validationRules[name as keyof T] = getValidationFns(validations);

      // Setup error messages
      newFormState.errorMessages[name as keyof T] = { ...defaultErrorMessages, ...errorMessages };

      // Check if field is valid
      const { hasError, errors } = checkIfFieldIsValid(newFormState.validationRules[name as keyof T], defaultValue);

      // Set isDirty true if defaultValue is anything other than null or empty string
      const isDirty = defaultValue !== null && defaultValue !== '';

      // Set value to default value
      newFormState.values[name as keyof T] = defaultValue;

      // Set the field
      newFormState.fields[name as keyof T] = {
        touched: false,
        dirty: isDirty,
        hasError,
        showError: isDirty && hasError, // Show error if the field is dirty
        isRequired: Boolean(required),
        isValid: !hasError && isDirty,
        errors: hasError ? getErrorMessages(errors, newFormState.errorMessages[name as keyof T]) : [],
      };
    });

    // Check if the form is valid
    newFormState.isValid = checkIfFormIsValid<T>(newFormState);

    setFormState(newFormState);
    setSetupComplete(true);
  }, []);

  useEffect(() => {
    if (setupComplete && newValues) {
      const newFormState = cloneFormState(formState);

      Object.entries(newValues).forEach(([name, value]) => {
        // Check if field is valid
        const { hasError, errors } = checkIfFieldIsValid(newFormState.validationRules[name as keyof T], value as T[keyof T] | null | '');

        // Set new value
        newFormState.values[name as keyof T] = value as T[keyof T] | null | '';

        // Set the field
        newFormState.fields[name as keyof T] = {
          ...newFormState.fields[name as keyof T],
          dirty: true,
          hasError,
          showError: hasError,
          isValid: !hasError,
          errors: hasError ? getErrorMessages(errors, newFormState.errorMessages[name as keyof T]) : [],
        };
      });

      // Check if the form is valid
      newFormState.isValid = checkIfFormIsValid<T>(newFormState);

      setFormState(newFormState);
      setNewValues(null);
    }
  }, [setupComplete, newValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newFormState = cloneFormState(formState);
    const { name, value } = event.target;
    // Update value
    newFormState.values[name as keyof T] = value as unknown as T[keyof T] | null | '';

    // Check if field has any errors
    const { hasError, errors } = checkIfFieldIsValid(newFormState.validationRules[name as keyof T], value as unknown as T[keyof T] | null | '');

    // Grab the previous state of the field
    const previousFieldState = newFormState.fields[name as keyof T];

    // Determine if we should show any errors
    const shouldShowError = (previousFieldState.showError // Show error if previously true
      || previousFieldState.touched) // OR show error if field has been touched (blurred once)
      && hasError; // AND hasError

    // Determine if the field is dirty
    const isDirty = previousFieldState.dirty // Dirty if previously dirty
      || (!previousFieldState.dirty // OR not previously dirty
        && value !== '' && value !== null); // AND has a potentially valid value

    // Set the field
    const newFieldState: Field = {
      ...previousFieldState,
      touched: previousFieldState.touched,
      dirty: isDirty,
      isValid: !hasError && isDirty,
      hasError,
      errors: hasError ? getErrorMessages(errors, newFormState.errorMessages[name as keyof T]) : [],
      showError: shouldShowError,
    };

    // Set new field state
    newFormState.fields[name as keyof T] = newFieldState;

    // Check if form is valid
    newFormState.isValid = checkIfFormIsValid(newFormState);
    setFormState(newFormState);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newFormState = cloneFormState(formState);
    const { name } = event.target;

    const field = newFormState.fields[name as keyof T];

    // Only need to run on blur if the field has not been blurred once (touched === false)
    // Validations run onChange
    if (!field.touched) {
      // Set new field state
      newFormState.fields[name as keyof T] = {
        ...newFormState.fields[name as keyof T],
        showError: field.hasError,
        touched: true,
      };

      setFormState(newFormState);
    }
  };

  return {
    fields: { ...formState.fields },
    isValid: formState.isValid,
    values: { ...formState.values },
    handleChange,
    handleBlur,
    setValues: setNewValues,
    setupComplete,
    validate: () => checkIfAllFieldsAreValid(formState),
  };
};

export default useFormValidator;
