import { useForm, SubmitHandler, RegisterOptions, FieldValues, Path, DefaultValues } from "react-hook-form"

export type FormFieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'date';

export interface FormField<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type: FormFieldType;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[]; // For select fields
    validation?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
}

export interface FormProps<T extends FieldValues> {
    fields: FormField<T>[];
    onSubmit: SubmitHandler<T>;
    className?: string;
    defaultValues?: DefaultValues<T>;
    id: string;
}

export type { SubmitHandler };

export const Form = <T extends FieldValues>({
    id,
    fields,
    onSubmit,
    className = '',
    defaultValues,
}: FormProps<T>) => {
    const { register, handleSubmit, formState: { errors } } = useForm<T>({
        defaultValues
    });

    const renderField = (field: FormField<T>) => {
        const { name, type, placeholder, options, validation } = field;

        switch (type) {
            case 'select':
                return (
                    <select
                        id={name.toString()}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-</option>
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        id={name.toString()}
                        placeholder={placeholder}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                );

            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        id={name.toString()}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                );

            default:
                return (
                    <input
                        type={type}
                        autoComplete={type === 'email' ? 'email' : 'off'}
                        id={name.toString()}
                        placeholder={placeholder}
                        {...register(name, validation as RegisterOptions<T, Path<T>>)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                );
        }
    };

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className={className}>
            {fields.map((field) => (
                <div key={field.name.toString()} className="mb-4">
                    <label
                        htmlFor={field.name.toString()}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

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