import React from 'react';
import { TextField } from '@mui/material';

interface LocationFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

const LocationField: React.FC<LocationFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Location"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      fullWidth
      margin="normal"
    />
  );
};

export default LocationField;
