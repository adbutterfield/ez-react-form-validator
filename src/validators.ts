export const validateGreaterThanOrEqualToMin = (min: number) => <T>(value: T[keyof T] | null | ''): { type: 'min', isValid: boolean } => {
  const numberValue = Number(value);
  if (value === null || value === '' || !numberValue) {
    return {
      type: 'min',
      isValid: false,
    };
  }

  return {
    type: 'min',
    isValid: numberValue >= min,
  };
};

export const validateLessThanOrEqualToMax = (max: number) => <T>(value: T[keyof T] | null | ''): { type: 'max', isValid: boolean } => {
  const numberValue = Number(value);
  if (value === null || value === '' || !numberValue) {
    return {
      type: 'max',
      isValid: false,
    };
  }

  return {
    type: 'max',
    isValid: numberValue <= max,
  };
};

export const validateLengthIsGreaterThanOrEqualToMin = (minLength: number) => <T>(value: T[keyof T] | null | ''): { type: 'minLength', isValid: boolean } => {
  if (typeof value !== 'string') {
    return {
      type: 'minLength',
      isValid: false,
    };
  }

  return {
    type: 'minLength',
    isValid: value.length >= minLength,
  };
};

export const validateLengthIsLessThanOrEqualToMax = (maxLength: number) => <T>(value: T[keyof T] | null | ''): { type: 'maxLength', isValid: boolean } => {
  if (typeof value !== 'string') {
    return {
      type: 'maxLength',
      isValid: false,
    };
  }

  return {
    type: 'maxLength',
    isValid: value.length <= maxLength,
  };
};

export const validateIsRequired = <T>(value: T[keyof T] | null | ''): { type: 'required', isValid: boolean } => {
  if (typeof value === 'string' && value === '') {
    return {
      type: 'required',
      isValid: false,
    };
  }
  return {
    type: 'required',
    isValid: value !== null && typeof value !== 'undefined',
  };
};

export const validatePattern = <T>(pattern: RegExp) => (value: T[keyof T] | null | ''): { type: 'pattern', isValid: boolean } => {
  return {
    type: 'pattern',
    isValid: pattern.test(String(value)),
  };
};
