import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, BarChart3, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-r border-gray-200/50 dark:border-slate-800/50 min-h-[calc(100vh-73px)] p-6 gap-6 transition-spring">
      <div className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-spring ${
              isActive
                ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/40 dark:border-blue-500/20 font-semibold shadow-[0_4px_12px_rgba(59,130,246,0.05)] dark:shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent hover:translate-x-0.5'
            }`
          }
        >
          <Users size={18} />
          <span>Leads Management</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-spring ${
              isActive
                ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/40 dark:border-blue-500/20 font-semibold shadow-[0_4px_12px_rgba(59,130,246,0.05)] dark:shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent hover:translate-x-0.5'
            }`
          }
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </NavLink>
      </div>

      <div className="mt-auto border-t border-slate-200 dark:border-slate-800/40 pt-6">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-spring ${
              isActive
                ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/40 dark:border-blue-500/20 font-semibold shadow-[0_4px_12px_rgba(59,130,246,0.05)] dark:shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent hover:translate-x-0.5'
            }`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
