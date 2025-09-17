import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your global styles
import ClientProvider from './store/ClientProvider'; // Your existing provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClientProvider>
      <App />
    </ClientProvider>
  </React.StrictMode>
);