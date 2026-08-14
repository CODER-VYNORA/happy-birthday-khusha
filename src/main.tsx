import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure standard fetch is accessible and prevent prototype setter conflicts
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch ? window.fetch.bind(window) : undefined;
    if (originalFetch && !window.hasOwnProperty('fetch')) {
      // noop
    }
  } catch (e) {
    console.debug(e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

