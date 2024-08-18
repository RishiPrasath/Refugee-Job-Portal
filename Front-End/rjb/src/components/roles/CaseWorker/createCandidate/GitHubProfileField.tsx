import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface GitHubProfileFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const GitHubProfileField: React.FC<GitHubProfileFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateURL = (url: string) => {
    return url.startsWith('https://github.com/') ? '' : 'Invalid GitHub URL';
  };

  const handleBlur = () => {
    const validationError = validateURL(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="GitHub Profile"
      name="github_profile"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default GitHubProfileField;