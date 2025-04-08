import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-3-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-3-gray-500',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-3-gray-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-3-gray-500',
  link: 'bg-transparent text-blue-600 hover:underline p-0 focus:ring-3-0',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-3-red-500'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 rounded',
  md: 'text-sm px-4 py-2 rounded-md',
  lg: 'text-base px-6 py-3 rounded-md'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Concatenate class names with spaces
    const buttonClasses = [
      'font-medium focus:outline-hidden focus:ring-3-2 focus:ring-3-offset-2 transition-colors',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
