import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useMouseGlow } from '../../hooks/useMouseGlow';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const glowRef = useMouseGlow<HTMLButtonElement>();

  const baseStyles =
    'relative overflow-hidden group/btn inline-flex items-center justify-center font-semibold rounded-lg transition-spring active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10 cursor-pointer border border-blue-700/20',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-gray-200/80 dark:border-slate-700/50 cursor-pointer',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/10 cursor-pointer border border-rose-700/20',
    outline: 'bg-transparent border border-gray-200 dark:border-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 cursor-pointer',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const isPrimaryOrDanger = variant === 'primary' || variant === 'danger';
  const glowColor = isPrimaryOrDanger
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(59, 130, 246, 0.1)';

  return (
    <button
      ref={glowRef}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Radial Hover Glow Overlay */}
      <span
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(80px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent 80%)`,
        }}
      />
      {loading ? (
        <LoadingSpinner size="sm" className="mr-2 relative z-10" />
      ) : icon ? (
        <span className="mr-2 flex items-center justify-center relative z-10">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
