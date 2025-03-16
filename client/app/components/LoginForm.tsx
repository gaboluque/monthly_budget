import React, { useState } from 'react';
import { Form, FormField, SubmitHandler } from './forms/Form';
import { Button } from './Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

interface LoginFormData {
  email: string;
  password: string;
}

const FORM_ID = 'login-form';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while signing in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement;
    if (form) form.requestSubmit();
  };

  const formFields: FormField<LoginFormData>[] = [
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      validation: {
        required: 'Email is required',
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: 'Email is invalid'
        }
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      validation: {
        required: 'Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      }
    }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form<LoginFormData>
        id={FORM_ID}
        fields={formFields}
        onSubmit={handleSubmit}
        className="space-y-4"
      />

      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          fullWidth
          onClick={submitForm}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};
