import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const UsernameField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateUsername = (username: string) => {
    if (!username) return 'Username is required';
    if (!/^[a-zA-Z0-9]+$/.test(username)) return 'Username must be alphanumeric';
    if (username.length < 3) return 'Username must be at least 3 characters';
    return '';
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
