import { useState } from 'react'
import { Input } from './Input'
import { formatCurrency } from '../../utils/currency'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  id: string
  required?: boolean
  fullWidth?: boolean
  helperText?: string
}

const parseCurrencyInput = (value: string): number => {
  // Remove currency symbol, commas, and other non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')
  
  // Ensure only one decimal point
  const parts = numericValue.split('.')
  if (parts.length > 2) return 0
  
  // If there's a decimal point, ensure only 2 decimal places
  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2)
  }
  
  return Number(parts.join('.')) || 0
}

export function CurrencyInput({ 
  value,
  onChange,
  label,
  id,
  required = false,
  fullWidth = false,
  helperText
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const numericValue = parseCurrencyInput(rawValue)
    onChange(numericValue)
    setDisplayValue(formatCurrency(numericValue))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = value.toString()
    e.target.select()
  }

  const handleBlur = () => {
    setDisplayValue(formatCurrency(value))
  }

  return (
    <Input
      label={label}
      id={id}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      required={required}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  )
} 