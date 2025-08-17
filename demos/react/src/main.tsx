import { init } from '@sentinel/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const { SentinelErrors } = init({
  dsn: 'http://localhost:3000'
});

createRoot(document.getElementById('root')!).render(
  <SentinelErrors>
    <StrictMode>
      <App />
    </StrictMode>
  </SentinelErrors>
);
