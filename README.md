# EZ React Form Validator

Simple, easy to use, form validator for React using hooks.

TODO: add badges

## Features

- Embraces controlled components.
- Use on any element/component that takes onChange, onBlur, and value as props.
- Super small, with no dependencies.
- Follows HTML standard for validation (required, min, max, minLength, maxLength, pattern).
- Written in TypeScript.

## Links

- TODO: link to sample app

## Install

    $ npm install ez-react-form-validator

## Basic Example

```jsx
import React from 'react';
import useFormValidator from 'ez-react-form-validator';

const validatorSetup = {
  firstName: {}, // All fields should have a config object. Name prop of the input is the key.
  lastName: {
    required: true, // Add required validation.
    defaultValue: '', // Set a default value. Setting a default value will trigger validation.
    minLength: 1, // ninLength and ninLength should only validate strings
    maxLength: 100,
  },
  age: {
    pattern: /\d+/, // Validate with regular expression
    min: 1, // min and max should only validate numbers
    max: 100,
    errorMessages: { // Set custom error messages for each validation.
      pattern: 'Please enter number for age.',
    }
  },
};

function App() {
  const {
    isValid, // Boolean to tell you if the form is valid.
    values, // Object with all the values of your form, name prop is the key for each corresponding value.
    handleChange, // Pass this to all onChange props.
    handleBlur, // Pass this to all onBlur props.
    setupComplete, // Boolean to tell you when the setup is complete.
    fields // Object with additional information about fields of your form, name prop is the key for each corresponding field. More on fields later.
  } = useFormValidator(validatorSetup); // initialize the hook

  return (
    // Wrap the entire form in a check for setupComplete to avoid the "Input elements should not switch from uncontrolled to controlled (or vice versa)" error.
    {setupComplete && <form>
      <input
        name="firstName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.firstName}
      />

      <input
        name="lastName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.lastName}
      />
      // Each field has a boolean showError (in addition to hasError), and an array of error messages
      {fields.lastName.showError && fields.lastName.errors[0]}

      <input
        name="age"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.age}
      />
      {fields.age.showError && fields.age.errors[0]}

      // Use isValid for things like disabling the submit button
      <button type="submit" disabled={!isValid}>Submit</button>
    </form>}
  );
}
```

## TypeScript Example

```jsx
import React from 'react';
import useFormValidator, { ValidatorSetup } from 'ez-react-form-validator';

// Define a type with all of the types for your inputs
type FormFields = {
  firstName: string,
  lastName: string,
  age: number,
};

// Add the ValidatorSetup type passing in the FormFields you defined
const validatorSetup: ValidatorSetup<FormFields> = {
  firstName: {
    ...other configuration
  },
  lastName: {
    ...other configuration
  },
  age: {
    ...other configuration
  },
};
```

## Other Cool Features

```jsx
import React from 'react';
import useFormValidator from 'ez-react-form-validator';

const validatorSetup = {
  firstName: {
    ...other configuration
  },
  lastName: {
    ...other configuration
  },
  age: {
    ...other configuration
  },
};

function App() {
  const {
    isValid,
    values,
    handleChange,
    handleBlur,
    setupComplete,
    fields,
    setValues, // Use this to set all/some of your form fields.
    validate, // Use this to validate your form at any time you might want to.
    reset, // Use this to return the form to its original state.
    } = useFormValidator(validatorSetup); // initialize the hook

  return (
    {setupComplete && <form>
      <input
        name="firstName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.firstName}
      />

      <input
        name="lastName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.lastName}
      />
      {fields.lastName.showError && fields.lastName.errors[0]}

      <input
        name="age"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.age}
      />
      {fields.age.showError && fields.age.errors[0]}

      <button type="submit" disabled={!isValid}>Submit</button>

      // The validate function will set showError to true for all fields that have any errors.
      <button type="button" onClick={validate}>Validate</button>

      // The setValues function will set values based on name of the field, and validate each field, setting show error to true on any field with errors.
      <button type="button" onClick={() => setValues({ firstName: 'Boaty', lastName: 'McBoatface', age: 3})}>Set Values</button>

      // The reset function will reset any errors or values, and make the form the same as when it was initially loaded.
      <button type="button" onClick={reset}>Reset</button>
    </form>}
  );
}
```

## More on Fields

A field is defined by this type in TypeScript:

```
type Field = {
  touched: boolean;
  dirty: boolean;
  hasError: boolean;
  showError: boolean;
  isRequired: boolean;
  isValid: boolean;
  errors: string[];
};
```

Let's look at each of these properties in more detail.

- touched: Set to `true` after a field has been blurred once.
- dirty: Set to `true` after a field receives input (setting a defaultValue also counts).
- hasError: Set to `true` if a field has an error. Validations are run immediately during setup, so unless there are no validations, or a valid defaultValue is set, this will be `false` initially.
- showError: Set to `true` when (in my opinion) you should display error state and error messages. If you don't agree with me, you can create your own logic for when to show errors using a combination of hasError/touched/dirty.
- isRequired: Set to `true` if the field has a required validation.
- isValid: Set to `true` if the field has no errors.

## More on Configuration

The validator configuration is defined by these types in TypeScript:

```
type ValidatorSetup<T> = {
  [K in keyof T]: Validation<T>;
};

type Validation<T> = {
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
```

Let's look at each of these properties in more detail.

- defaultValue: Initial value, if any, that you would like to set the field to have. If there is no defaultValue, it will default to an empty string.
- required: Set to true if the field is required.
- pattern: Pass a regular expression to validate against the value.
- min: Validates a number against a numerical minimum.
- max: Validates a number against a numerical maximum.
- minLength: Validates a string against a minimum length of characters.
- maxLength: Validates a string against a maximum length of characters.
- errorMessages: An object, with keys for each type of validation, for setting custom error messages. See default error messages in the next section.

## Default Error Messages

By default, each validation type have a different default message.

- required: 'This field is required'
- pattern: 'This field is does not match the correct pattern'
- min: 'This field does not exceed the min value'
- max: 'This field exceeds the max value'
- minLength: 'This field does not exceed the min length'
- maxLength: 'This field exceeds the max length'
