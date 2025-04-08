import { useForm, SubmitHandler, RegisterOptions, FieldValues, Path, DefaultValues, useWatch } from "react-hook-form"
import { useEffect, useMemo } from "react";
import { OptionSelect } from "./fields/OptionSelect";
import { PasswordField } from "./fields/PasswordField";

export type FormFieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'multi-select' | 'textarea' | 'checkbox' | 'date' | 'radio' | 'optionSelect';

export type ConditionalRule<T extends FieldValues> = {
    field: Path<T>;
    operator: 'equals' | 'notEquals' | 'includes' | 'notIncludes';
    value: unknown;
}

export interface FormField<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type: FormFieldType;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string, children?: { value: string; label: string }[] }[]; // For select fields
    validation?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
    showWhen?: ConditionalRule<T>[];
}

export interface FormProps<T extends FieldValues> {
    fields: FormField<T>[];
    onSubmit: SubmitHandler<T>;
    className?: string;
    defaultValues?: DefaultValues<T>;
    id: string;
    onFieldChange?: (name: Path<T>, value: unknown) => void;
}

export type { SubmitHandler };

export const Form = <T extends FieldValues>({
    id,
    fields,
    onSubmit,
    className = '',
    defaultValues,
    onFieldChange,
}: FormProps<T>) => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<T>({
        defaultValues
    });

    // Watch all fields and notify when they change
    const values = useWatch({ control });

    useEffect(() => {
        if (onFieldChange && values) {
            // Find fields that have values and notify
            Object.entries(values).forEach(([fieldName, value]) => {
                if (value !== undefined) {
                    onFieldChange(fieldName as Path<T>, value);
                }
            });
        }
    }, [values, onFieldChange]);

    // Evaluate conditional visibility rules
    const evaluateRule = (rule: ConditionalRule<T>, formValues: Record<string, unknown>): boolean => {
        const fieldValue = formValues?.[rule.field as string];

        switch (rule.operator) {
            case 'equals':
                return fieldValue === rule.value;
            case 'notEquals':
                return fieldValue !== rule.value;
            case 'includes':
                return Array.isArray(rule.value) && rule.value.includes(fieldValue);
            case 'notIncludes':
                return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
            default:
                return true;
        }
    };

    const evaluateVisibility = (field: FormField<T>): boolean => {
        if (!field.showWhen || !values) return true;

        return field.showWhen.every(rule => evaluateRule(rule, values));
    };

    // Filter fields based on visibility conditions
    const visibleFields = useMemo(() => {
        return fields.filter(evaluateVisibility);
    }, [fields, values]);

    const renderField = (field: FormField<T>) => {
        const { name, type, placeholder, options, validation } = field;

        switch (type) {
            case 'password':
                return (
                    <PasswordField
                        name={name}
                        placeholder={placeholder}
                        validation={validation}
                        register={register}
                    />
                );
            case 'optionSelect':
            case 'multi-select':
                return (
                    <OptionSelect
                        name={name}
                        label={field.label}
                        placeholder={placeholder}
                        options={options || []}
                        value={values?.[name as string]}
                        isMulti={type === 'multi-select'}
                        register={register}
                        onChange={(value) => {
                            if (onFieldChange) {
                                onFieldChange(name, value);
                            }
                        }}
                    />
                );
            
            case 'select':
                return (
                    <select
                        id={name.toString()}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="w-full p-2 border rounded-sm focus:outline-hidden focus:ring-3-2 focus:ring-3-blue-500"
                    >
                        <option value="">-</option>
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="flex w-full">
                        {options?.map((option, index) => (
                            <label
                                key={option.value}
                                className="flex-1 flex items-center"
                            >
                                <input
                                    type="radio"
                                    value={option.value}
                                    {...register(name, validation as RegisterOptions<T, Path<T>>)}
                                    className="sr-only" // Hide the actual radio input
                                />
                                <span className={`w-full text-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors
                                    ${index === 0 ? 'rounded-l' : ''} 
                                    ${index === options.length - 1 ? 'rounded-r' : ''}
                                    ${values?.[name as string] === option.value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'textarea':
                return (
                    <textarea
                        id={name.toString()}
                        placeholder={placeholder}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="w-full p-2 border rounded-sm focus:outline-hidden focus:ring-3-2 focus:ring-3-blue-500"
                    />
                );

            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={name.toString()}
                            {...register(name, validation as RegisterOptions<T, Path<T>>)}
                            className="h-5 w-5 text-blue-600 focus:ring-3-blue-500 border-gray-300 rounded-sm transition-colors cursor-pointer"
                        />
                        <label
                            htmlFor={name.toString()}
                            className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    </div>
                );

            default:
                return (
                    <input
                        type={type}
                        autoComplete={type === 'email' ? 'email' : 'off'}
                        id={name.toString()}
                        placeholder={placeholder}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="w-full p-2 border rounded-sm focus:outline-hidden focus:ring-3-2 focus:ring-3-blue-500"
                    />
                );
        }
    };

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className={className}>
            {visibleFields.map((field) => (
                <div key={field.name.toString()} className="mb-4">
                    {field.type !== 'checkbox' && (
                        <label
                            htmlFor={field.name.toString()}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}

                    {renderField(field)}

                    {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors[field.name]?.message as string}
                        </p>
                    )}
                </div>
            ))}
        </form>
    );
};