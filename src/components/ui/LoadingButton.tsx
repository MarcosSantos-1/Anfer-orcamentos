// src/components/ui/LoadingButton.tsx
import React, { useState } from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingButtonProps {
  onClick: () => Promise<void> | void;
  leftIcon?: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger';
  className?: string;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  leftIcon,
  variant = 'primary',
  className = '',
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'outline':
        return 'border border-zinc-600 text-zinc-800 hover:bg-zinc-100';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await Promise.resolve(onClick());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center ${getVariantClasses()} ${className} ${
        isLoading ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <FiLoader className="animate-spin mr-2" />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}
      {children}
    </button>
  );
};

export default LoadingButton;