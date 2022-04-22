import React, { useEffect, useState } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useAuthContext } from '../api/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import connection from '../api/connection';
import ErrorMessage from '../components/ErrorMessage';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import Page from '../components/Page';

const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be 8 digits.')
    .required('Password is required.'),
});

const initialValues = {
  password: '',
};

const Login = () => {
  const searchParams = useSearchParams()[0];
  const navigate = useNavigate();
  const { logIn } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('t');
    const jwtDecoded = jwtDecode(token);
    const expiry = moment(new Date(jwtDecoded.exp * 1000));
    const isExpired = moment().isAfter(expiry);
    if (isExpired) navigate('/');
  }, [navigate, searchParams]);

  const handleSubmit = async (values, actions) => {
    setIsLoading(true);
    const token = searchParams.get('t');
    const username = jwtDecode(token).sub;

    if (!username) {
      actions.setErrors({
        api: 'Token is invalid.',
      });
      setIsLoading(false);
      return;
    }

    const request = {
      resetToken: token,
      newPassword: values.password,
    };

    const resetResult = await connection.post('/user/resetpassword', request);

    if (resetResult.ok) {
      const logInFormData = new FormData();
      logInFormData.append('username', username);
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
          resetResult.data && resetResult.data.message
            ? resetResult.data.message
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
        Reset Password
      </div>
      <p>Please enter the new password you'd like.</p>
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

            <InputLabel style={{ marginTop: 10 }}>New password</InputLabel>
            <TextField
              disabled={isLoading}
              error={props.errors.password !== undefined}
              value={props.values.password}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              style={{ width: 300 }}
              size='small'
              name='password'
              type='password'
            />
            <Button
              disabled={isLoading}
              type='submit'
              style={{ marginTop: 20, width: 300 }}
              variant='contained'
              onClick={props.handleSubmit}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Formik>
    </Page>
  );
};

export default Login;
