import { Path, FieldValues, UseFormRegister } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';

interface MultiOptionSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: { value: string; label: string, children?: { value: string; label: string }[] }[]; // For select fields
  value?: number[];
  register: UseFormRegister<T>;
  onChange: (value: number[]) => void;
}

export function MultiOptionSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Select options",
  options,
  value = [],
  register,
  onChange
}: MultiOptionSelectProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<number[]>(value);
  
  // Update local state when value prop changes
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);
  
  // Get the selected categories names as a comma separated string
  const getSelectedCategoriesText = (): string => {
    if (!selectedValues.length) return '';

    const selectedLabels: string[] = [];
    
    // Check each option
    options.forEach(option => {
      if (selectedValues.includes(Number(option.value))) {
        selectedLabels.push(option.label);
      }
      
      // Check children as well
      if (option.children) {
        option.children.forEach(child => {
          if (selectedValues.includes(Number(child.value))) {
            selectedLabels.push(child.label);
          }
        });
      }
    });

    return selectedLabels.join(', ');
  };

  const { onChange: registerOnChange } = register(name);

  const handleToggleCategory = (categoryId: string | number) => {
    const numValue = Number(categoryId);
    const newValues = [...selectedValues];
    
    // Toggle the selection
    const index = newValues.indexOf(numValue);
    if (index === -1) {
      // Add
      newValues.push(numValue);
    } else {
      // Remove
      newValues.splice(index, 1);
    }
    
    // Update local state
    setSelectedValues(newValues);
    
    // Call the onChange callback
    onChange(newValues);
    
    // Update the form value
    registerOnChange({ target: { name, value: newValues } });
  };
  
  const handleSave = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={name.toString()}
        readOnly
        value={getSelectedCategoriesText()}
        placeholder={placeholder}
        className="w-full p-2 border rounded-sm focus:outline-hidden focus:ring-3-2 focus:ring-3-blue-500 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => handleSave()} 
        title={label}
        zIndex={300}
      >
        <div className="space-y-2 overflow-y-auto max-h-[60vh] pb-10">
          {options.map((option) => (
            <div key={option.value} className="space-y-1">
              <div 
                className={`p-2 border rounded-sm cursor-pointer hover:bg-gray-100 ${
                  selectedValues.includes(Number(option.value)) ? 'bg-blue-100 border-blue-500' : ''
                }`}
                onClick={() => handleToggleCategory(option.value)}
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
                      className={`p-2 border rounded-sm cursor-pointer hover:bg-gray-100 ${
                        selectedValues.includes(Number(child.value)) ? 'bg-blue-100 border-blue-500' : ''
                      }`}
                      onClick={() => handleToggleCategory(child.value)}
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
        
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
            onClick={handleSave}
          >
            Done
          </button>
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
