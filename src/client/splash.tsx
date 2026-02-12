import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-8 p-4 bg-gradient-to-b from-slate-900 to-slate-800">

      {/* Hero Section */}
      <div className="flex flex-col items-center gap-2 animate-fade-in">
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
          <h1 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tighter text-center">
            CIPHER
            <br />
            BREAKER
          </h1>
        </div>

        <p className="text-xl text-blue-200/80 font-light tracking-wide text-center max-w-md">
          Crack the code. Reveal the wisdom.
        </p>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <button
          className="group relative px-8 py-4 bg-white text-slate-900 font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          <span className="relative z-10 flex items-center gap-2">
            START DECODING
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opactiy-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center text-sm text-slate-500 font-medium">
        <p>Daily Brain Training</p>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
