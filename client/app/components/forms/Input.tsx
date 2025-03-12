import React from 'react';

type Option = {
  value: string;
  label: string;
};

interface BaseProps {
  label: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
  type: 'select';
  options: Option[];
}

type CombinedInputProps = InputProps | SelectProps;

export const Input = React.forwardRef<HTMLInputElement | HTMLSelectElement, CombinedInputProps>(
  ({ label, error, fullWidth = false, helperText, className = '', leftIcon, rightIcon, id, type = 'text', ...props }, ref) => {
    // Use a stable ID based on props
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Build class names directly
    const containerStyle = fullWidth ? { width: '100%' } : {};
    
    // Base input classes
    const baseClass = 'block px-4 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900';
    const errorClass = error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
    const paddingClass = `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Combine all classes
    const elementClass = `${baseClass} ${errorClass} ${paddingClass} ${widthClass} ${className}`.trim();

    return (
      <div style={containerStyle}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          {type === 'select' ? (
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              id={inputId}
              className={elementClass}
              {...(props as SelectProps)}
            >
              {(props as SelectProps).options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              type={type}
              className={elementClass}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              {...(props as InputProps)}
            />
          )}
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
