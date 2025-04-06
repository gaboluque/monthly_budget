import { Path, FieldValues, UseFormRegister } from 'react-hook-form';
import { useState } from 'react';
import { Modal } from '../../ui/Modal';

interface OptionSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: { value: string; label: string, children?: { value: string; label: string }[] }[]; // For select fields
  value?: string;
  register: UseFormRegister<T>;
  onChange: (value: string) => void;
}

export function OptionSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Select an option",
  options,
  value,
  register,
  onChange
}: OptionSelectProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Find the selected category or subcategory name
  const getSelectedCategoryName = (): string => {
    if (!value) return '';

    // First check parent categories
    const parent = options.find(opt => opt.value === value);
    if (parent) return parent.label;

    // Then check subcategories
    for (const option of options) {
      if (option.children) {
        const child = option.children.find(sub => sub.value === value);
        if (child) return child.label;
      }
    }

    return '';
  };

  const { onChange: registerOnChange } = register(name);

  const handleCategorySelect = (categoryId: string | number) => {
    const stringValue = categoryId.toString();
    // Call the onChange callback
    onChange(stringValue);
    
    // Update the form value
    registerOnChange({ target: { name, value: stringValue } });
    
    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={name.toString()}
        readOnly
        value={getSelectedCategoryName()}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={label}
        zIndex={300}
      >
        <div className="space-y-2 overflow-y-auto max-h-[60vh] pb-10">
          {options.map((option) => (
            <div key={option.value} className="space-y-1">
              <div 
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                  value === option.value ? 'bg-blue-100 border-blue-500' : ''
                }`}
                onClick={() => handleCategorySelect(option.value)}
              >
                <div className="flex items-center">
                  <span>{option.label}</span>
                </div>
              </div>
              
              {option.children && option.children.length > 0 && (
                <div className="pl-4 space-y-1">
                  {option.children.map((child) => (
                    <div 
                      key={child.value} 
                      className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                        value === child.value ? 'bg-blue-100 border-blue-500' : ''
                      }`}
                      onClick={() => handleCategorySelect(child.value)}
                    >
                      <div className="flex items-center">
                        <span>{child.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
      
      {/* Hidden input to store the actual form value */}
      <input
        type="hidden"
        {...register(name)}
        id={`${name}-hidden`}
      />
    </div>
  );
} 