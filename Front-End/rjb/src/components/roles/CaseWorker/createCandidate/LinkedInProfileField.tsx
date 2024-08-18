import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface LinkedInProfileFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const LinkedInProfileField: React.FC<LinkedInProfileFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateURL = (url: string) => {
    return url.startsWith('https://www.linkedin.com/') ? '' : 'Invalid LinkedIn URL';
  };

  const handleBlur = () => {
    const validationError = validateURL(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="LinkedIn Profile"
      name="linkedin_profile"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default LinkedInProfileField;