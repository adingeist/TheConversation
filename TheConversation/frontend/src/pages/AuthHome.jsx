import React, { useEffect, useState } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import connection from '../api/connection';
import ErrorMessage from '../components/ErrorMessage';
import Page from '../components/Page';
import Post from '../components/Post';

const initialValues = {
  message: '',
};

const loginSchema = Yup.object().shape({
  message: Yup.string().required('Content is required.'),
});

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async ({ message }, actions) => {
    setIsLoading(true);
    const result = await connection.postWithAuthToken('/post', {
      message,
    });
    if (result.ok) {
      await fetchPosts();
      actions.setFieldValue('message', '');
    } else {
      actions.setErrors({
        api:
          result.data && result.data.message
            ? result.data.message
            : 'An unexpected error occurred posting.',
      });
    }
    setIsLoading(false);
  };

  const fetchPosts = async () => {
    const result = await connection.getWithAuthToken('/posts');
    if (result.ok) {
      setPosts(result.data.reverse());
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Page>
      <div style={{ width: '100%' }}>
        <h2 style={{ margin: 0 }}>Make a post</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handlePost}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(props) => (
            <form style={{ display: 'flex', flexDirection: 'column' }}>
              <ErrorMessage errors={props.errors} />

              <InputLabel style={{ marginTop: 10 }}>New message</InputLabel>
              <TextField
                disabled={isLoading}
                error={props.errors.message !== undefined}
                value={props.values.message}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{ width: 300 }}
                size='small'
                name='message'
              />
              <Button
                disabled={isLoading}
                type='submit'
                style={{ marginTop: 10, width: 300 }}
                variant='contained'
                onClick={props.handleSubmit}
              >
                Post
              </Button>
            </form>
          )}
        </Formik>
      </div>

      <div style={{ width: '100%' }}>
        <h2>Posts</h2>
        {posts.map((post) => (
          <Post
            key={`post_${post.id}`}
            createdAt={post.createdAt}
            message={post.message}
            username={post.user.username}
            name={post.user.name}
          />
        ))}
      </div>
    </Page>
  );
};

export default Home;
