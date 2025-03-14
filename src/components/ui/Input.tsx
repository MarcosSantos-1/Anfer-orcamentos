// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
       <input
        ref={ref}
        className={`
          block w-full rounded-xl border-2 bg-white/50
          px-2 py-1 text-gray-900 
          ring-1 ring-transparent
          transition-all duration-200 ease-in-out
          focus:border-blue-500 focus:ring-4 focus:ring-blue-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${leftIcon ? 'pl-12' : ''}
          ${rightIcon ? 'pr-12' : ''}
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}
          ${className}
        `}
        {...props}
      />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
