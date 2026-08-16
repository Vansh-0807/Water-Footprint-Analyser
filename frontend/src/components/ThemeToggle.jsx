import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`
        relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-opacity-75
        ${isDarkMode ? 'bg-stone-700' : 'bg-emerald-200'}
      `}
      aria-label="Toggle Dark Mode"
    >
      <span className="sr-only">Toggle Dark Mode</span>
      
      {/* Background Icons */}
      <span className="absolute inset-0 flex h-full w-full items-center justify-between px-1.5 transition-opacity">
        <Moon className={`h-4 w-4 text-stone-400 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
        <Sun className={`h-4 w-4 text-emerald-600 transition-opacity duration-300 ${!isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
      </span>

      {/* Thumb */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute left-0.5 inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-500 ease-in-out
          ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
