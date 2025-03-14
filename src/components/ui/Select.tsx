// src/components/ui/Select.tsx
import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select
        ref={ref}
        className={`
          block w-full rounded-xl border-2 bg-white/50 text-md
          px-2 py-1 text-gray-900  ring-1 ring-transparent disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200 ease-in-out
          focus:border-blue-500 focus:ring-blue-500 sm:text-lg
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;