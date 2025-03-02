import React, { InputHTMLAttributes, forwardRef } from 'react';
import { classNames } from '@/utils/classNames';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = true, 
    type = 'text',
    ...props 
  }, ref) => {
    const baseInputStyles = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
    const errorInputStyles = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
    const iconInputStyles = leftIcon ? 'pl-10' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return (
      <div className={classNames(widthStyles, className || '')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={classNames(
              baseInputStyles,
              errorInputStyles,
              iconInputStyles
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 