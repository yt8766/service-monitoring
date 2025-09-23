import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="h-screen w-screen flex justify-center items-center bg-[#f7f8fc]">
      <App />
    </div>
  </StrictMode>
);
