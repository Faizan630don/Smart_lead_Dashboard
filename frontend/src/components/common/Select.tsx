import { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 transition-spring duration-200 cursor-pointer ${
            error ? 'border-rose-500 focus:border-rose-500' : ''
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="bg-white dark:bg-slate-900 text-slate-500">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-400 font-medium animate-fade-in">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
