import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { NavLink } from 'react-router-dom';
import { Users, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-205 pb-16 md:pb-0">
      <Navbar />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <div className="w-[1px] bg-gradient-to-b from-gray-200/50 via-gray-200/10 to-transparent dark:from-slate-800/50 dark:via-slate-800/10 dark:to-transparent hidden md:block self-stretch" />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-slate-800/50 py-2 px-6 flex items-center justify-around md:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.04)] select-none">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold tracking-wider transition-spring ${
              isActive ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-500 dark:text-slate-450'
            }`
          }
        >
          <Users size={20} />
          <span>Leads</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold tracking-wider transition-spring ${
              isActive ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-500 dark:text-slate-450'
            }`
          }
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold tracking-wider transition-spring ${
              isActive ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-500 dark:text-slate-450'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
