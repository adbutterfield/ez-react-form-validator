export type Validation<T> = {
  defaultValue?: T[keyof T] | '';
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  errorMessages?: {
    required?: string;
    pattern?: string;
    min?: string;
    max?: string;
    minLength?: string;
    maxLength?: string;
  };
};

export type ValidatorSetup<T> = {
  [K in keyof T]: Validation<T>;
};

export type ValidatorFn<T, K extends keyof T> = (value: T[K] | '') => { type: ErrorTypes; isValid: boolean };

export type Field = {
  touched: boolean;
  dirty: boolean;
  hasError: boolean;
  showError: boolean;
  isRequired: boolean;
  isValid: boolean;
  errors: string[];
};

export type ErrorTypes = 'required' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength';

export type ErrorMessages = {
  required: string;
  pattern: string;
  min: string;
  max: string;
  minLength: string;
  maxLength: string;
};

export type FormState<T> = {
  values: {
    [K in keyof T]: T[K] | '';
  };
  fields: {
    [K in keyof T]: Field;
  };
  validationRules: {
    [K in keyof T]: ValidatorFn<T, K>[];
  };
  isValid: boolean;
  errorMessages: {
    [K in keyof T]: ErrorMessages;
  };
};
