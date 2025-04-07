import { Path, FieldValues, UseFormRegister } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';

interface OptionSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: { value: string; label: string, children?: { value: string; label: string }[] }[]; // For select fields
  value?: string | number[];
  isMulti?: boolean;
  register: UseFormRegister<T>;
  onChange: (value: string | number[]) => void;
}

export function OptionSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Select an option",
  options,
  value,
  isMulti = false,
  register,
  onChange
}: OptionSelectProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<number[]>(
    isMulti 
      ? (Array.isArray(value) ? value : []) 
      : (value && !Array.isArray(value) ? [Number(value)] : [])
  );
  
  // Update local state when value prop changes
  useEffect(() => {
    if (isMulti) {
      setSelectedValues(Array.isArray(value) ? value : []);
    } else {
      setSelectedValues(value && !Array.isArray(value) ? [Number(value)] : []);
    }
  }, [value, isMulti]);
  
  // Get selected category names as string
  const getSelectedText = (): string => {
    if (!selectedValues.length) return '';

    if (!isMulti) {
      // Single select mode - show only the first selected value
      const selectedValue = selectedValues[0]?.toString();
      
      // First check parent categories
      const parent = options.find(opt => opt.value === selectedValue);
      if (parent) return parent.label;

      // Then check subcategories
      for (const option of options) {
        if (option.children) {
          const child = option.children.find(sub => sub.value === selectedValue);
          if (child) return child.label;
        }
      }
      
      return '';
    } else {
      // Multi-select mode - show comma-separated list
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
    }
  };

  const { onChange: registerOnChange } = register(name);

  const handleCategorySelect = (categoryId: string | number) => {
    const numValue = Number(categoryId);
    
    if (!isMulti) {
      // Single select mode
      setSelectedValues([numValue]);
      const stringValue = categoryId.toString();
      
      // Call the onChange callback
      onChange(stringValue);
      
      // Update the form value
      registerOnChange({ target: { name, value: stringValue } });
      
      // Close the modal
      setIsModalOpen(false);
    } else {
      // Multi-select mode
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
    }
  };
  
  const handleSave = () => {
    // Close modal in multi-select mode when save is clicked
    if (isMulti) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={name.toString()}
        readOnly
        value={getSelectedText()}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedValues.includes(Number(option.value)) ? 'bg-blue-100 border-blue-500' : ''
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
                        selectedValues.includes(Number(child.value)) ? 'bg-blue-100 border-blue-500' : ''
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
        
        {isMulti && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Done
            </button>
          </div>
        )}
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