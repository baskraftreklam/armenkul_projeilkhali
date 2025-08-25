import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // YENİ EKLENDİ

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA'i aktive etmek için bu satırı çağırıyoruz
serviceWorkerRegistration.register(); // YENİ EKLENDİ