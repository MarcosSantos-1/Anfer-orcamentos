import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  leftIcon,
  className = '',
  rows = 4,
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
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            {leftIcon}
          </div>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            block w-full rounded-xl border-2 bg-white/50
            px-2 py-3 text-zinc-900 
            ring-1 ring-transparent text-lg
            transition-all duration-200 ease-in-out
            focus:border-blue-500 focus:ring-4 focus:ring-blue-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-12' : ''}
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}
            resize-none
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

export default Textarea;