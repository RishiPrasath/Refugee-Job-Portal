import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*\d)(?=.*[a-zA-Z])/.test(password)) return 'Password must include letters and numbers';
    return '';
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
