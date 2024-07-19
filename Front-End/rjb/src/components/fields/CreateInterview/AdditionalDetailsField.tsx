import React from 'react';
import { TextField } from '@mui/material';

interface AdditionalDetailsFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const AdditionalDetailsField: React.FC<AdditionalDetailsFieldProps> = ({ value, onChange }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 500) {
      setError('Additional details cannot exceed 500 characters');
    } else {
      setError(null);
    }
    onChange(newValue);
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      label="Additional Details"
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
    />
  );
};

export default AdditionalDetailsField;