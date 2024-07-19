import React from 'react';
import { TextField } from '@mui/material';

interface LocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationField: React.FC<LocationFieldProps> = ({ value, onChange }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue) {
      setError('Location is required');
    } else {
      setError(null);
    }
    onChange(newValue);
  };

  return (
    <TextField
      fullWidth
      label="Location"
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
    />
  );
};

export default LocationField;