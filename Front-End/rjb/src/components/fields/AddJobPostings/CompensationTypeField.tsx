import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface CompensationTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

const CompensationTypeField: React.FC<CompensationTypeFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Compensation Type"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      select
      fullWidth
      margin="normal"
    >
      <MenuItem value="Hourly">Hourly</MenuItem>
      <MenuItem value="Monthly">Monthly</MenuItem>
      <MenuItem value="Annual">Annual</MenuItem>
    </TextField>
  );
};

export default CompensationTypeField;
