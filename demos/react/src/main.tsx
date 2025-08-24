import * as Sentinel from '@sentinel/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

Sentinel.init({
  dsn: 'http://localhost:3000'
});
createRoot(document.getElementById('root')!, {
  onUncaughtError: Sentinel.reactErrorHandler((error, errorInfo) => {
    console.log('Uncaught Error:', error, errorInfo);
  }),
  onCaughtError: (error, errorInfo) => {
    console.log('Caught Error:', error, errorInfo);
  },
  onRecoverableError: error => {
    console.log('Recoverable Error:', error);
  }
}).render(
  // <Sentinel.ErrorBoundary
  //   fallback={error => {
  //     return <h1>错误： {error.message}</h1>;
  //   }}
  // >
  <StrictMode>
    <App />
  </StrictMode>
  // </Sentinel.ErrorBoundary>
);
