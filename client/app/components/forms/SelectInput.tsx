import { Input } from '../forms/Input'

interface SelectOption {
  value: string
  label: string
}

interface SelectInputProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  required?: boolean
  fullWidth?: boolean
  helperText?: string
}

export function SelectInput({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  fullWidth = false,
  helperText
}: SelectInputProps) {
  return (
    <Input
      type="select"
      label={label}
      id={id}
      value={value}
      onChange={onChange}
      options={options}
      required={required}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  )
} 