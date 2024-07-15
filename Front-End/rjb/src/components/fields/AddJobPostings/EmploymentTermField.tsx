import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface EmploymentTermFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

const EmploymentTermField: React.FC<EmploymentTermFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Employment Term"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      select
      fullWidth
      margin="normal"
    >
      <MenuItem value="Permanent">Permanent</MenuItem>
      <MenuItem value="Temporary">Temporary</MenuItem>
    </TextField>
  );
};

export default EmploymentTermField;
