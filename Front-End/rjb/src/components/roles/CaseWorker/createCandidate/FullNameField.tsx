import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface FullNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FullNameField: React.FC<FullNameFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateFullName = (fullName: string) => {
    return fullName ? '' : 'Full name is required';
  };

  const handleBlur = () => {
    const validationError = validateFullName(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Full Name"
      name="full_name"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default FullNameField;