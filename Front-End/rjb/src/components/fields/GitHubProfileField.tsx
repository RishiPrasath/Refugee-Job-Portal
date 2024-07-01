import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const GitHubProfileField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateGitHubProfile = (url: string) => {
    return /^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/.test(url) ? '' : 'Must be a valid GitHub URL';
  };

  const handleBlur = () => {
    const validationError = validateGitHubProfile(value);
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