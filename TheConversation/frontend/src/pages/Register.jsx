import React, { useState } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useAuthContext } from '../api/AuthContext';
import * as Yup from 'yup';
import connection from '../api/connection';
import ErrorMessage from '../components/ErrorMessage';
import Page from '../components/Page';

const loginSchema = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  email: Yup.string()
    .email('Email must be valid.')
    .required('Email is required.'),
  username: Yup.string().required('Username is required.'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters or more.')
    .required('Password is required.'),
});

const initialValues = {
  name: '',
  email: '',
  username: '',
  password: '',
};

const Register = () => {
  const { logIn } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values, actions) => {
    setIsLoading(true);
    const regResult = await connection.post('/user/save', values);

    if (regResult.ok) {
      const logInFormData = new FormData();
      logInFormData.append('username', values.username);
      logInFormData.append('password', values.password);

      const loginResult = await connection.post('/login', logInFormData, {
        'Content-Type': 'multipart/form-data',
      });

      if (loginResult.ok) {
        await logIn(
          loginResult.data.access_token,
          loginResult.data.refresh_token
        );
      } else {
        actions.setErrors({ api: 'An unexpected error occurred logging in.' });
      }
    } else {
      actions.setErrors({
        api:
          regResult.data && regResult.data.message
            ? regResult.data.message
            : 'An unexpected error occurred resetting the password.',
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
        Register
      </div>
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

            <InputLabel style={{ marginTop: 10 }}>Name</InputLabel>
            <TextField
              disabled={isLoading}
              error={props.errors.name !== undefined}
              value={props.values.name}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              style={{ width: 300 }}
              size='small'
              name='name'
            />
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
            <InputLabel style={{ marginTop: 10 }}>Username</InputLabel>
            <TextField
              disabled={isLoading}
              error={props.errors.username !== undefined}
              value={props.values.username}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              style={{ width: 300 }}
              size='small'
              name='username'
            />
            <InputLabel style={{ marginTop: 10 }}>Password</InputLabel>
            <TextField
              disabled={isLoading}
              error={props.errors.password !== undefined}
              value={props.values.password}
              style={{ width: 300 }}
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              size='small'
              type='password'
              name='password'
            />
            <Button
              disabled={isLoading}
              type='submit'
              style={{ marginTop: 20, width: 300 }}
              variant='contained'
              onClick={props.handleSubmit}
            >
              Register
            </Button>
          </form>
        )}
      </Formik>
      <p>
        Already have an account? <a href='/login'>Login</a>.
      </p>
    </Page>
  );
};

export default Register;
