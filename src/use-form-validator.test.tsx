// @ts-nocheck
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// import { act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import useFormValidator, { ValidatorSetup } from './index';

describe('useFormValidator', () => {
  it('validates a required field', async () => {
    type FormValues = {
      requiredDefaultError: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      requiredDefaultError: {
        required: true,
      },
    };

    type TestComponentProps = {
      formConfig: ValidatorSetup
    };

    const TestComponent: React.FC<TestComponentProps> = () => {
      const { values, handleChange, handleBlur, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          {/* required field with default error message */}
          <label htmlFor="requiredDefaultError">requiredDefaultError
            <input id="requiredDefaultError" name="requiredDefaultError" value={values.requiredDefaultError || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.requiredDefaultError?.showError && <p data-testid="requiredDefaultError-error">{fields.requiredDefaultError.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId, getByLabelText } = render(<TestComponent formConfig={formConfig} />);
    const requiredDefaultError = () => getByLabelText('requiredDefaultError');
    const requiredDefaultErrorError = () => queryByTestId('requiredDefaultError-error');

    // CASE: Expect error message not be present initially
    expect(requiredDefaultErrorError()).toBeNull();

    // CASE: The error message should not show, until blurred
    fireEvent.change(requiredDefaultError(), { target: { value: '' } });
    fireEvent.blur(requiredDefaultError());
    // Check that the default error message is displayed
    expect(requiredDefaultErrorError()).toHaveTextContent('This field is required');
  });

  it('validates a field with minLength', async () => {
    type FormValues = {
      stringWithMinLength: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      stringWithMinLength: {
        required: true,
        minLength: 3,
        errorMessages: {
          minLength: 'too short',
        },
      },
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          {/* min length field with custom error message */}
          <label htmlFor="stringWithMinLength">stringWithMinLength
            <input id="stringWithMinLength" name="stringWithMinLength" value={values.stringWithMinLength || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.stringWithMinLength?.hasError && <p data-testid="stringWithMinLength-hasError">stringWithMinLength has error</p>}
          {fields.stringWithMinLength?.showError && <p data-testid="stringWithMinLength-error">{fields.stringWithMinLength.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId, getByLabelText } = render(<TestComponent formConfig={formConfig} />);
    const stringWithMinLength = () => getByLabelText('stringWithMinLength');
    const stringWithMinLengthError = () => queryByTestId('stringWithMinLength-error');
    const stringWithMinLengthHasError = () => queryByTestId('stringWithMinLength-hasError');

    // CASE: Expect error message to not be present initially
    expect(stringWithMinLengthError()).toBeNull();

    // CASE: The error message should not show, until blurred
    fireEvent.change(stringWithMinLength(), { target: { value: 'a' } });
    // Check that the error message is not displayed
    expect(stringWithMinLengthError()).toBeNull();
    // Check that the field does have an error
    expect(stringWithMinLengthHasError()).not.toBeNull();

    // CASE: A field with an error should show the error on blur
    fireEvent.blur(stringWithMinLength());
    // Check that the error message is displayed
    expect(stringWithMinLengthError()).not.toBeNull();
    // Check that the custom error message is displayed
    expect(stringWithMinLengthError()).toHaveTextContent('too short');
    // Check that the field does have an error
    expect(stringWithMinLengthHasError()).not.toBeNull();

    // CASE: A field continues to show the error state, until it reaches the valid state
    fireEvent.change(stringWithMinLength(), { target: { value: 'aa' } });
    // Check that the error message is displayed
    expect(stringWithMinLengthError()).not.toBeNull();
    // Check that the field does have an error
    expect(stringWithMinLengthHasError()).not.toBeNull();
    fireEvent.blur(stringWithMinLength());

    // CASE: A field has no errors, once it reaches the valid state
    fireEvent.change(stringWithMinLength(), { target: { value: 'aaa' } });
    // Check that the error message is not displayed
    expect(stringWithMinLengthError()).toBeNull();
    // Check that the field does not have any error
    expect(stringWithMinLengthHasError()).toBeNull();

    // CASE: Field is valid if longer than minLength
    fireEvent.change(stringWithMinLength(), { target: { value: 'aaaa' } });
    // Check that the error message is not displayed
    expect(stringWithMinLengthError()).toBeNull();
    // Check that the field does not have any error
    expect(stringWithMinLengthHasError()).toBeNull();
  });

  it('validates a field with maxLength', async () => {
    type FormValues = {
      stringWithMaxLength: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      stringWithMaxLength: {
        required: true,
        maxLength: 3,
        errorMessages: {
          maxLength: 'too long',
        },
      },
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          {/* max length field with custom error message */}
          <label htmlFor="stringWithMaxLength">stringWithMaxLength
            <input id="stringWithMaxLength" name="stringWithMaxLength" value={values.stringWithMaxLength || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.stringWithMaxLength?.hasError && <p data-testid="stringWithMaxLength-hasError">stringWithMaxLength has error</p>}
          {fields.stringWithMaxLength?.showError && <p data-testid="stringWithMaxLength-error">{fields.stringWithMaxLength.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId, getByLabelText } = render(<TestComponent />);
    const stringWithMaxLength = () => getByLabelText('stringWithMaxLength');
    const stringWithMaxLengthError = () => queryByTestId('stringWithMaxLength-error');
    const stringWithMaxLengthHasError = () => queryByTestId('stringWithMaxLength-hasError');

    // CASE: Expect error message to not be present initially
    expect(stringWithMaxLengthError()).toBeNull();

    // CASE: The error message should not show, until blurred
    fireEvent.change(stringWithMaxLength(), { target: { value: 'aaaa' } });
    // Check that the error message is not displayed
    expect(stringWithMaxLengthError()).toBeNull();
    // Check that the field does have an error
    expect(stringWithMaxLengthHasError()).not.toBeNull();

    // CASE: A field with an error should show the error on blur
    fireEvent.blur(stringWithMaxLength());
    // Check that the error message is displayed
    expect(stringWithMaxLengthError()).not.toBeNull();
    // Check that the custom error message is displayed
    expect(stringWithMaxLengthError()).toHaveTextContent('too long');
    // Check that the field does have an error
    expect(stringWithMaxLengthHasError()).not.toBeNull();

    // CASE: A field continues to show the error state, until it reaches the valid state
    fireEvent.change(stringWithMaxLength(), { target: { value: 'aaaaa' } });
    // Check that the error message is displayed
    expect(stringWithMaxLengthError()).not.toBeNull();
    // Check that the field does have an error
    expect(stringWithMaxLengthHasError()).not.toBeNull();

    // CASE: A field has no errors, once it reaches the valid state
    fireEvent.change(stringWithMaxLength(), { target: { value: 'aaa' } });
    // Check that the error message is not displayed
    expect(stringWithMaxLengthError()).toBeNull();
    // Check that the field does not have any error
    expect(stringWithMaxLengthHasError()).toBeNull();

    // CASE: Field is valid if shorter than maxLength
    fireEvent.change(stringWithMaxLength(), { target: { value: 'aa' } });
    // Check that the error message is not displayed
    expect(stringWithMaxLengthError()).toBeNull();
    // Check that the field does not have any error
    expect(stringWithMaxLengthHasError()).toBeNull();
  });

  it('validates a field by regex pattern', async () => {
    type FormValues = {
      emailWithPattern: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      emailWithPattern: {
        required: true,
        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        errorMessages: {
          pattern: 'bad pattern',
        },
      },
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          {/* pattern field with custom error message */}
          <label htmlFor="emailWithPattern">emailWithPattern
            <input id="emailWithPattern" name="emailWithPattern" value={values.emailWithPattern || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.emailWithPattern?.hasError && <p data-testid="emailWithPattern-hasError">emailWithPattern has error</p>}
          {fields.emailWithPattern?.showError && <p data-testid="emailWithPattern-error">{fields.emailWithPattern.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId, getByLabelText } = render(<TestComponent />);
    const emailWithPattern = () => getByLabelText('emailWithPattern');
    const emailWithPatternError = () => queryByTestId('emailWithPattern-error');
    const emailWithPatternHasError = () => queryByTestId('emailWithPattern-hasError');

    // CASE: Expect error message to not be present initially
    expect(emailWithPatternError()).toBeNull();

    // CASE: The error message should not show, until blurred
    fireEvent.change(emailWithPattern(), { target: { value: 'a' } });
    // Check that the error message is not displayed
    expect(emailWithPatternError()).toBeNull();
    // Check that the field does have an error
    expect(emailWithPatternHasError()).not.toBeNull();

    // CASE: A field with an error should show the error on blur
    fireEvent.blur(emailWithPattern());
    // Check that the error message is displayed
    expect(emailWithPatternError()).not.toBeNull();
    // Check that the custom error message is displayed
    expect(emailWithPatternError()).toHaveTextContent('bad pattern');
    // Check that the field does have an error
    expect(emailWithPatternHasError()).not.toBeNull();

    // CASE: A field continues to show the error state, until it reaches the valid state
    fireEvent.change(emailWithPattern(), { target: { value: 'a@' } });
    // Check that the error message is displayed
    expect(emailWithPatternError()).not.toBeNull();
    // Check that the field does have an error
    expect(emailWithPatternHasError()).not.toBeNull();

    // CASE: A field has no errors, once it reaches the valid state
    fireEvent.change(emailWithPattern(), { target: { value: 'a@b.com' } });
    // Check that the error message is not displayed
    expect(emailWithPatternError()).toBeNull();
    // Check that the field does not have any error
    expect(emailWithPatternHasError()).toBeNull();
  });

  it('validates a field with min', async () => {
    type FormValues = {
      numberWithMin: number;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      numberWithMin: {
        required: true,
        min: 3,
        errorMessages: {
          min: 'not enough',
        },
      },
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          {/* pattern field with custom error message */}
          <label htmlFor="numberWithMin">numberWithMin
            <input id="numberWithMin" name="numberWithMin" value={values.numberWithMin || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.numberWithMin?.hasError && <p data-testid="numberWithMin-hasError">numberWithMin has error</p>}
          {fields.numberWithMin?.showError && <p data-testid="numberWithMin-error">{fields.numberWithMin.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId, getByLabelText } = render(<TestComponent />);
    const numberWithMin = () => getByLabelText('numberWithMin');
    const numberWithMinError = () => queryByTestId('numberWithMin-error');
    const numberWithMinHasError = () => queryByTestId('numberWithMin-hasError');

    // CASE: Expect error message to not be present initially
    expect(numberWithMinError()).toBeNull();

    // CASE: The error message should not show, until blurred
    fireEvent.change(numberWithMin(), { target: { value: 1 } });
    // Check that the error message is not displayed
    expect(numberWithMinError()).toBeNull();
    // Check that the field does have an error
    expect(numberWithMinHasError()).not.toBeNull();

    // CASE: A field with an error should show the error on blur
    fireEvent.blur(numberWithMin());
    // Check that the error message is displayed
    expect(numberWithMinError()).not.toBeNull();
    // Check that the custom error message is displayed
    expect(numberWithMinError()).toHaveTextContent('not enough');
    // Check that the field does have an error
    expect(numberWithMinHasError()).not.toBeNull();

    // CASE: A field continues to show the error state, until it reaches the valid state
    fireEvent.change(numberWithMin(), { target: { value: 2 } });
    // Check that the error message is displayed
    expect(numberWithMinError()).not.toBeNull();
    // Check that the field does have an error
    expect(numberWithMinHasError()).not.toBeNull();

    // CASE: A field has no errors, once it reaches the valid state
    fireEvent.change(numberWithMin(), { target: { value: 3 } });
    // Check that the error message is not displayed
    expect(numberWithMinError()).toBeNull();
    // Check that the field does not have any error
    expect(numberWithMinHasError()).toBeNull();

    // CASE: Field is valid if more than min
    fireEvent.change(numberWithMin(), { target: { value: 4 } });
    // Check that the error message is not displayed
    expect(numberWithMinError()).toBeNull();
    // Check that the field does not have any error
    expect(numberWithMinHasError()).toBeNull();
  });

  it('validates a field with max', async () => {
    type FormValues = {
      numberWithMax: number;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      numberWithMax: {
        required: true,
        max: 3,
        errorMessages: {
          max: 'too much',
        },
      },
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          {/* pattern field with custom error message */}
          <label htmlFor="numberWithMax">numberWithMax
            <input id="numberWithMax" name="numberWithMax" value={values.numberWithMax || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.numberWithMax?.hasError && <p data-testid="numberWithMax-hasError">numberWithMax has error</p>}
          {fields.numberWithMax?.showError && <p data-testid="numberWithMax-error">{fields.numberWithMax.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId, getByLabelText } = render(<TestComponent />);
    const numberWithMax = () => getByLabelText('numberWithMax');
    const numberWithMaxError = () => queryByTestId('numberWithMax-error');
    const numberWithMaxHasError = () => queryByTestId('numberWithMax-hasError');

    // CASE: Expect error message to not be present initially
    expect(numberWithMaxError()).toBeNull();

    // CASE: The error message should not show, until blurred
    fireEvent.change(numberWithMax(), { target: { value: 5 } });
    // Check that the error message is not displayed
    expect(numberWithMaxError()).toBeNull();
    // Check that the field does have an error
    expect(numberWithMaxHasError()).not.toBeNull();

    // CASE: A field with an error should show the error on blur
    fireEvent.blur(numberWithMax());
    // Check that the error message is displayed
    expect(numberWithMaxError()).not.toBeNull();
    // Check that the custom error message is displayed
    expect(numberWithMaxError()).toHaveTextContent('too much');
    // Check that the field does have an error
    expect(numberWithMaxHasError()).not.toBeNull();

    // CASE: A field continues to show the error state, until it reaches the valid state
    fireEvent.change(numberWithMax(), { target: { value: 4 } });
    // Check that the error message is displayed
    expect(numberWithMaxError()).not.toBeNull();
    // Check that the field does have an error
    expect(numberWithMaxHasError()).not.toBeNull();

    // CASE: A field has no errors, once it reaches the valid state
    fireEvent.change(numberWithMax(), { target: { value: 3 } });
    // Check that the error message is not displayed
    expect(numberWithMaxError()).toBeNull();
    // Check that the field does not have any error
    expect(numberWithMaxHasError()).toBeNull();

    // CASE: Field is valid if less than max
    fireEvent.change(numberWithMax(), { target: { value: 2 } });
    // Check that the error message is not displayed
    expect(numberWithMaxError()).toBeNull();
    // Check that the field does not have any error
    expect(numberWithMaxHasError()).toBeNull();
  });

  it('indicates form is invalid until all fields are valid', async () => {
    type FormValues = {
      field1: string;
      field2: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      field1: {
        required: true,
        defaultValue: '',
      },
      field2: {
        required: true,
      },
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, isValid, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          <label htmlFor="field1">field1
            <input id="field1" name="field1" value={values.field1 || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.field1?.hasError && <p data-testid="field1-hasError">field1 has error</p>}
          {fields.field1?.showError && <p data-testid="field1-error">{fields.field1.errors[0]}</p>}
          <label htmlFor="field2">field2
            <input id="field2" name="field2" value={values.field2 || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          {fields.field2?.hasError && <p data-testid="field2-hasError">field2 has error</p>}
          {fields.field2?.showError && <p data-testid="field2-error">{fields.field2.errors[0]}</p>}
          <p data-testid="isValid">{String(isValid)}</p>
          <button type="submit" disabled={!isValid}>submit</button>
        </form>
      );
    };

    const { getByLabelText, getByText, queryByTestId } = render(<TestComponent />);
    const field1 = () => getByLabelText('field1');
    const field1Error = () => queryByTestId('field1-error');
    const field1HasError = () => queryByTestId('field1-hasError');
    const field2 = () => getByLabelText('field2');
    const field2Error = () => queryByTestId('field2-error');
    const field2HasError = () => queryByTestId('field2-hasError');
    const isValid = () => queryByTestId('isValid');
    const submit = () => getByText('submit');

    // CASE: Form should be invalid initially
    expect(submit()).toBeDisabled();

    // CASE: Errors should not be displayed initially
    expect(field1Error()).toBeNull();
    expect(field2Error()).toBeNull();
    // CASE: Fields should have errors if invalid, even initially
    expect(field1HasError()).not.toBeNull();
    expect(field2HasError()).not.toBeNull();

    // CASE: Form should be invalid even if one field is valid
    fireEvent.change(field1(), { target: { value: 'a' } });
    // Check that the error message is not displayed
    expect(field1Error()).toBeNull();
    // Check that the field does not have an error
    expect(field1HasError()).toBeNull();
    // Check that the submit button is still disabled
    expect(submit()).toBeDisabled();
    expect(isValid()).toHaveTextContent('false');

    // CASE: Form should become valid when all fields are valid (no need to blur)
    fireEvent.change(field2(), { target: { value: 'a' } });
    // Check that the error message is not displayed
    expect(field2Error()).toBeNull();
    // Check that the field does not have an error
    expect(field2HasError()).toBeNull();
    // Check that the submit button is still disabled
    expect(submit()).not.toBeDisabled();
    expect(isValid()).toHaveTextContent('true');
  });

  it('can resets form values using setValues', async () => {
    type FormValues = {
      field1: string;
      field2: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      field1: {
        minLength: 10,
      },
      field2: {},
    };

    const TestComponent: React.FC = () => {
      const { values, handleChange, handleBlur, setValues } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          <label htmlFor="field1">field1
            <input id="field1" name="field1" value={values.field1 || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          <label htmlFor="field2">field2
            <input id="field2" name="field2" value={values.field2 || ''} onChange={handleChange} onBlur={handleBlur} />
          </label>
          <button type="button" onClick={() => setValues({ field1: 'reset 1', field2: 'reset 2' })}>reset</button>
        </form>
      );
    };

    const { getByLabelText, getByText } = render(<TestComponent />);
    const field1 = () => getByLabelText('field1');
    const field2 = () => getByLabelText('field2');
    const resetButton = () => getByText('reset');

    // CASE: Form values can be set using setValues
    fireEvent.change(field1(), { target: { value: 'a' } });
    fireEvent.change(field2(), { target: { value: 'a' } });
    fireEvent.blur(field2());
    fireEvent.click(resetButton());
    expect(field1()).toHaveValue('reset 1');
    expect(field2()).toHaveValue('reset 2');
  });

  it('sets fields with default values', async () => {
    type FormValues = {
      field1: string;
      field2: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      field1: {
        defaultValue: 'default 1',
      },
      field2: {
        defaultValue: 'default 2',
      },
    };

    const TestComponent: React.FC = () => {
      const { values, setupComplete } = useFormValidator<FormValues>(formConfig);

      return (
        <>
          {setupComplete && (
          <form>
            <label htmlFor="field1">field1
              <input id="field1" name="field1" value={values.field1} readOnly />
            </label>
            <label htmlFor="field2">field2
              <input id="field2" name="field2" value={values.field2} readOnly />
            </label>
          </form>
          )}
        </>
      );
    };

    const { getByLabelText } = render(<TestComponent />);
    const field1 = () => getByLabelText('field1');
    const field2 = () => getByLabelText('field2');

    // CASE: Form values can have default values
    expect(field1()).toHaveValue('default 1');
    expect(field2()).toHaveValue('default 2');
  });

  it('display error message if default value doesn\'t pass validation', async () => {
    type FormValues = {
      field1: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      field1: {
        minLength: 10,
        defaultValue: 'too short',
      },
    };

    const TestComponent: React.FC = () => {
      const { values, fields } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          <label htmlFor="field1">field1
            <input id="field1" name="field1" value={values.field1 || ''} readOnly />
          </label>
          {fields.field1?.hasError && <p data-testid="field1-hasError">field1 has error</p>}
          {fields.field1?.showError && <p data-testid="field1-error">{fields.field1.errors[0]}</p>}
        </form>
      );
    };

    const { queryByTestId } = render(<TestComponent />);
    const field1Error = () => queryByTestId('field1-error');
    const field1HasError = () => queryByTestId('field1-hasError');

    // CASE: Errors should be displayed initially if defaultValue is invalid
    expect(field1Error()).not.toBeNull();
    expect(field1Error()).toHaveTextContent('This field does not exceed the min length');
    // CASE: Fields should have errors if defaultValue is invalid
    expect(field1HasError()).not.toBeNull();
    expect(field1HasError()).toHaveTextContent('field1 has error');
  });

  it('throws an error if a field has both min OR max AND minLength OR maxLength validations', async () => {
    type FormValues = {
      field1: string;
    };

    const formConfig: ValidatorSetup<FormValues> = {
      field1: {
        minLength: 10,
        min: 10,
      },
      field2: {
        maxLength: 10,
        max: 10,
      },
    };

    const TestComponent: React.FC = () => {
      const { values } = useFormValidator<FormValues>(formConfig);

      return (
        <form>
          <label htmlFor="field1">field1
            <input id="field1" name="field1" value={values.field1 || ''} readOnly />
          </label>
          <label htmlFor="field2">field2
            <input id="field2" name="field2" value={values.field2 || ''} readOnly />
          </label>
        </form>
      );
    };

    expect(() => render(<TestComponent />)).toThrowError('A field can only have min/max OR minLength/maxLength validation');
  });
});
