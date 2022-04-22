import React from 'react';

const Page = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: 900,
          padding: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Page;
