// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { QuotationProvider } from './context/QuotationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QuotationProvider>
        <App />
      </QuotationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
