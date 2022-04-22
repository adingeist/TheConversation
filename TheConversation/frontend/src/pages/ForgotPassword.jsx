import { Button, InputLabel, TextField } from '@mui/material';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import ErrorMessage from '../components/ErrorMessage';
import Page from '../components/Page';
import connection from '../api/connection';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Provide a valid email.')
    .required('Email is required.'),
});

const initialValues = {
  email: '',
};

const Login = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({ email }, actions) => {
    setIsLoading(true);
    const result = await connection.post('/user/forgotpassword', { email });
    console.log(result);
    if (result.ok) {
      setEmailSent(true);
    } else {
      actions.setErrors({
        api:
          result.data && result.data.error
            ? result.data.error
            : 'An unexpected error occurred.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Page>
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >
        Forgot your password?
      </div>
      {(!emailSent && (
        <>
          {' '}
          <p>
            That's ok. You can receive a link to get you back in your account.
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {(props) => (
              <form style={{ display: 'flex', flexDirection: 'column' }}>
                <ErrorMessage errors={props.errors} />

                <InputLabel style={{ marginTop: 10 }}>Email</InputLabel>
                <TextField
                  disabled={isLoading}
                  error={props.errors.email !== undefined}
                  value={props.values.email}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  style={{ width: 300 }}
                  size='small'
                  name='email'
                />
                <Button
                  disabled={isLoading}
                  onClick={props.handleSubmit}
                  style={{ marginTop: 20, width: 300 }}
                  type='submit'
                  variant='contained'
                >
                  Send Reset Link
                </Button>
              </form>
            )}
          </Formik>
        </>
      )) || <p>Please check your inbox.</p>}
    </Page>
  );
};

export default Login;
