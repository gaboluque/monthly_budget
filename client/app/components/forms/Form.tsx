import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  error,
  children,
  className = '',
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Concatenate class names with spaces
  const formClasses = ['space-y-4', className].filter(Boolean).join(' ');

  return (
    <form
      onSubmit={handleSubmit}
      className={formClasses}
      noValidate
      {...props}
    >
      {children}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </form>
  );
};

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
}) => {
  // Concatenate class names with spaces
  const groupClasses = ['space-y-4', className].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {children}
    </div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = '',
}) => {
  // Concatenate class names with spaces
  const actionClasses = ['flex items-center justify-end space-x-3 pt-2', className].filter(Boolean).join(' ');

  return (
    <div className={actionClasses}>
      {children}
    </div>
  );
};
