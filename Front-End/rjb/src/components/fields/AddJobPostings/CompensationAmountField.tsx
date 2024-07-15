import React from 'react';
import { TextField } from '@mui/material';

interface CompensationAmountFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  onBlur: () => void;
  error?: string;
}

const CompensationAmountField: React.FC<CompensationAmountFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Compensation Amount"
      type="number"
      value={value !== null ? value : ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      fullWidth
      margin="normal"
    />
  );
};

export default CompensationAmountField;
