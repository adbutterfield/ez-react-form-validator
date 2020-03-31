export const validateGreaterThanOrEqualToMin = (minLength: number) => <T>(value: T[keyof T]): { type: 'min', isValid: boolean } => {
  return {
    type: 'min',
    isValid: String(value).length >= minLength,
  };
};

export const validateLessThanOrEqualToMax = (maxLength: number) => <T>(value: T[keyof T]): { type: 'max', isValid: boolean } => {
  return {
    type: 'max',
    isValid: String(value).length <= maxLength,
  };
};

export const validateIsRequired = <T>(value: T[keyof T]): { type: 'required', isValid: boolean } => {
  if (typeof value === 'string' && value === '') {
    return {
      type: 'required',
      isValid: false,
    };
  }
  return {
    type: 'required',
    isValid: value !== null || (typeof value === 'string' && value !== ''),
  };
};

export const validatePattern = <T>(pattern: RegExp) => (value: T[keyof T]): { type: 'pattern', isValid: boolean } => {
  return {
    type: 'pattern',
    isValid: value === null ? false : pattern.test(String(value)),
  };
};
