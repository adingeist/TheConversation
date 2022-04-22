import React from 'react';
import moment from 'moment';

const Post = ({ name, username, message, createdAt }) => {
  const formattedDate = moment(createdAt).format('MM-DD-YY LT');

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: 'rgb(248, 248, 248)',
        borderStyle: 'solid',
        borderColor: 'rgb(230, 230, 230)',
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 2,
        borderRadius: 7,
      }}
    >
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>{name}</p>
        <p
          style={{
            marginLeft: 4,
            color: 'rgb(150, 150, 150)',
            fontSize: 12,
          }}
        >
          @{username}
        </p>
        <p
          style={{
            fontSize: 12,
            marginLeft: 'auto',
            color: 'rgb(150, 150, 150)',
          }}
        >
          {formattedDate}
        </p>
      </div>
      <p style={{ marginTop: 0, paddingLeft: 8, paddingRight: 8 }}>{message}</p>
    </div>
  );
};

export default Post;
