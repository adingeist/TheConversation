import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

document.body.style.backgroundColor = '#eee';
document.body.style.flex = 1;
document.body.style.margin = 0;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
