import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppRoutes } from './routes/AppRoutes';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './auth/AuthContext'; // 👈 importa tu contexto

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 envuelve tu app */}
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
