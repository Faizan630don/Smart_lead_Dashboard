import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { Shield } from 'lucide-react';
import { APP_NAME } from '../constants/config';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b111e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center animate-fade-in transition-colors duration-200 relative overflow-hidden">
      {/* Premium Ambient Light Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center gap-3 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Shield className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{APP_NAME}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-450">Sign in to access your sales pipelines</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-2xl sm:px-10 border border-gray-200/50 dark:border-slate-800/50 mx-4">
          <LoginForm />

          <div className="mt-6 text-center border-t border-slate-200 dark:border-slate-800/60 pt-5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Create account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
