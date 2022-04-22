import React from 'react';
import Page from '../components/Page';

const Home = () => {
  return (
    <Page>
      <h1 style={{ margin: 12 }}>Welcome to The Conversation.</h1>
      <p style={{ margin: 6 }}>
        It looks like you're not signed in. <a href='/login'>Sign in</a>.
      </p>
      <p style={{ margin: 6 }}>
        You must be signed in to read and post messages.
      </p>
      <p style={{ margin: 6 }}>
        Don't have an account? <a href='/register'>Register here</a>.
      </p>
    </Page>
  );
};

export default Home;
