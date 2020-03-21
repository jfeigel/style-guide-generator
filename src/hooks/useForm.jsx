import { useCallback, useEffect, useState } from 'react';

function useForm(stateSchema, validationSchema = {}, callback) {
  const [state, setState] = useState(stateSchema);
  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Used to disable the submit button if there's an error in state
  // or the required field in the state has no value.
  // Wrapped in useCallback to cache the function to avoid intensive memory leaks
  // in every re-render of the component
  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value;
      const stateError = state[key].error;

      return (isInputFieldRequired && !stateValue) || stateError;
    });

    return hasErrorInState;
  }, [state, validationSchema]);

  // Used to handle every change in every input
  const handleOnChange = useCallback(
    event => {
      setIsDirty(true);

      const name = event.target.name;
      const value = event.target.value;

      let error = '';
      if (validationSchema[name].required && !value) {
        error = 'This is a required field.';
      }

      if (
        validationSchema[name].validator !== null &&
        typeof validationSchema[name].validator === 'object' &&
        value
      ) {
        if (
          validationSchema[name].validator.regEx &&
          !validationSchema[name].validator.regEx.test(value)
        ) {
          error = validationSchema[name].validator.error;
        }

        if (
          validationSchema[name].validator.match &&
          state[validationSchema[name].validator.match].value !== value
        ) {
          error = validationSchema[name].validator.error;
        }
      }

      setState(prevState => ({
        ...prevState,
        [name]: {
          value,
          error
        }
      }));
    },
    [state, validationSchema]
  );

  const handleOnSubmit = useCallback(
    event => {
      event.preventDefault();

      // Make sure that validateState returns false
      // Before calling the submit callback function
      if (!validateState()) {
        callback(state);
      }
    },
    [callback, state, validateState]
  );

  // Disable button on initial render
  useEffect(() => {
    setDisable(true);
  }, [setDisable]);

  // For every changed item in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty) {
      setDisable(validateState());
    }
  }, [validateState, isDirty]);

  return {
    state,
    setState,
    disable,
    handleOnChange,
    handleOnSubmit
  };
}

export default useForm;
