import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validatePassword = (password: string) => {
    return password.length >= 6 ? '' : 'Password must be at least 6 characters';
  };

  const handleBlur = () => {
    const validationError = validatePassword(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Password"
      type="password"
      name="password"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default PasswordField;