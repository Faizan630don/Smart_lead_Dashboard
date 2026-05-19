import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';
import { APP_NAME } from '../../constants/config';
import ThemeToggle from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50 transition-spring shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="text-white" size={18} />
        </div>
        <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-wider">
          {APP_NAME}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {user && (
          <>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl">
              <div className="w-7 h-7 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                <UserIcon size={14} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-850 dark:text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                  {user.role?.replace('_', ' ') || 'sales user'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-all duration-200 cursor-pointer"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
