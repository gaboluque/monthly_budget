import React, { useState } from 'react';
import { Input } from './Input';

interface AutocompleteProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  fullWidth?: boolean;
  helperText?: string;
}

export function Autocomplete({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  fullWidth = false,
  helperText,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setFilteredOptions(
      options.filter(option =>
        option.toLowerCase().includes(newValue.toLowerCase())
      )
    );
    onChange(newValue);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setShowOptions(false);
    onChange(option);
  };

  return (
    <div className={`autocomplete ${fullWidth ? 'w-full' : ''}`}>
      <Input
        label={label}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setShowOptions(false)}
        required={required}
        fullWidth={fullWidth}
        helperText={helperText}
        autoComplete="off"
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto w-full">
          {filteredOptions.map(option => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOptionClick(option);
              }}
              tabIndex={0}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 w-full text-left text-black"
            >
              {option}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
}

Autocomplete.displayName = 'Autocomplete'; 