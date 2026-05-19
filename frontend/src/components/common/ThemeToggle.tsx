import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900/60 border border-gray-250 dark:border-slate-800 rounded-lg p-1 select-none">
      {/* Sliding Background Pill */}
      <div
        className="absolute top-1 bottom-1 rounded-md bg-white dark:bg-slate-800 shadow-sm border border-gray-200/50 dark:border-slate-700/50 transition-spring duration-300"
        style={{
          width: '32px',
          transform:
            theme === 'light'
              ? 'translateX(0)'
              : theme === 'dark'
              ? 'translateX(32px)'
              : 'translateX(64px)',
        }}
      />

      <button
        onClick={() => setTheme('light')}
        className={`w-8 h-8 flex items-center justify-center rounded-md relative z-10 transition-colors duration-250 cursor-pointer ${
          theme === 'light'
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Light theme"
      >
        <Sun size={14} />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`w-8 h-8 flex items-center justify-center rounded-md relative z-10 transition-colors duration-250 cursor-pointer ${
          theme === 'dark'
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Dark theme"
      >
        <Moon size={14} />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`w-8 h-8 flex items-center justify-center rounded-md relative z-10 transition-colors duration-250 cursor-pointer ${
          theme === 'system'
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="System setting"
      >
        <Laptop size={14} />
      </button>
    </div>
  );
};

export default ThemeToggle;
