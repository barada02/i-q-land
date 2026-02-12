import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CipherGame } from './components/CipherGame';

export const App = () => {
  return (
    <div className="min-h-screen">
      <CipherGame />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
