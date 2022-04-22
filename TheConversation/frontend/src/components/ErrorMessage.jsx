import React from 'react';

const ErrorMessage = ({ errors }) => {
  return (
    <>
      {Object.values(errors).length > 0 ? (
        <div
          style={{
            backgroundColor: 'rgb(255, 220, 220)',
            width: 280,
            borderRadius: 5,
            padding: 10,
          }}
        >
          {Object.values(errors).map((str, index) => (
            <div
              key={`error-${index}-${str}`}
              style={{ marginBottom: 2, marginTop: 2 }}
            >
              {'• '}
              {str}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default ErrorMessage;
