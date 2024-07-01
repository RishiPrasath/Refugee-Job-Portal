import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const LocationField: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <TextField
      fullWidth
      label="Location"
      name="location"  // Ensure the name attribute is set
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || ''}
      sx={{ mb: 2 }}  // Add bottom margin
    />
  );
};

export default LocationField;