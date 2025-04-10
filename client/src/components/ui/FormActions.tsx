import { ReactNode } from 'react';
import { Button } from './Button';

export interface FormActionsProps {
    isSubmitting?: boolean;
    onCancel?: () => void;
    onSubmit?: () => void;
    formId?: string;
    submitLabel?: string;
    cancelLabel?: string;
    additionalActions?: ReactNode;
    isEditing?: boolean;
}

export function FormActions({
    isSubmitting = false,
    onCancel,
    onSubmit,
    formId,
    submitLabel,
    cancelLabel = 'Cancel',
    additionalActions,
    isEditing = false
}: FormActionsProps) {

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit();
        } else if (formId) {
            const form = document.getElementById(formId) as HTMLFormElement;
            if (form) form.requestSubmit();
        }
    };

    const getSubmitLabel = () => {
        if (isSubmitting) return 'Saving...';
        if (submitLabel) return submitLabel;
        return isEditing ? 'Update' : 'Create';
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-row justify-end md:space-y-0 md:space-x-2 gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="w-1/2 md:w-auto"
                    >
                        {cancelLabel}
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-1/2 md:w-auto"
                >
                    {getSubmitLabel()}
                </Button>
            </div>

            {additionalActions && additionalActions}
        </div>
    );
} 