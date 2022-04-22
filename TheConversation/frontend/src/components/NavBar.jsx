import React from 'react';
import { useAuthContext } from '../api/AuthContext';

const NavBar = () => {
  const { user, logOut } = useAuthContext();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(125, 125, 255)',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: 900,
        }}
      >
        <a
          href='/'
          style={{
            fontSize: 24,
            padding: 10,
            color: '#fff',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          The Conversation
        </a>
        {user && (
          <p style={{ marginLeft: 'auto', color: '#fff' }}>
            Hi, {user.sub ? user.sub : ''}.{' '}
            <a href='#/' onClick={logOut} style={{ color: '#fff' }}>
              Logout
            </a>
            ?
          </p>
        )}
      </div>
    </div>
  );
};

export default NavBar;
