import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface UsernameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const UsernameField: React.FC<UsernameFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateUsername = (username: string) => {
    return username.length >= 3 ? '' : 'Username must be at least 3 characters';
  };

  const handleBlur = () => {
    const validationError = validateUsername(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Username"
      name="username"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default UsernameField;