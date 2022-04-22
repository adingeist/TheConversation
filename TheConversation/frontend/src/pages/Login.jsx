import { Button, InputLabel, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useAuthContext } from '../api/AuthContext';
import * as Yup from 'yup';
import connection from '../api/connection';
import ErrorMessage from '../components/ErrorMessage';
import Page from '../components/Page';
import React from 'react';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.'),
});

const initialValues = {
  username: '',
  password: '',
};

const Login = () => {
  const { logIn } = useAuthContext();

  const handleSubmit = async (values, actions) => {
    var bodyFormData = new FormData();
    bodyFormData.append('username', values.username);
    bodyFormData.append('password', values.password);

    const result = await connection.post('/login', bodyFormData, {
      'Content-Type': 'multipart/form-data',
    });

    if (result.ok) {
      await logIn(result.data.access_token, result.data.refresh_token);
    } else {
      if (result.problem === 'CLIENT_ERROR') {
        actions.setErrors({ api: 'Invalid username/password.' });
      } else if (result.originalError.message) {
        actions.setErrors({ api: result.originalError.message });
      } else {
        actions.setErrors({ api: 'An unexpected error occurred.' });
      }
    }
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
        Login
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

            <InputLabel style={{ marginTop: 10 }}>Username</InputLabel>
            <TextField
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
              error={props.errors.password !== undefined}
              value={props.values.password}
              style={{ width: 300 }}
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              size='small'
              type='password'
              name='password'
            />
            <a href='/forgotpassword' style={{ alignSelf: 'flex-end' }}>
              Forgot password?
            </a>
            <Button
              type='submit'
              style={{ marginTop: 20, width: 300 }}
              variant='contained'
              onClick={props.handleSubmit}
            >
              Login
            </Button>
          </form>
        )}
      </Formik>

      <p>
        Don't have an account? <a href='/register'>Register</a>
      </p>
    </Page>
  );
};

export default Login;
