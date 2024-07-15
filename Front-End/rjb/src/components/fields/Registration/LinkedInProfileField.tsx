import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const LinkedInProfileField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateLinkedInProfile = (url: string) => {
    return /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/.test(url) ? '' : 'Must be a valid LinkedIn URL';
  };

  const handleBlur = () => {
    const validationError = validateLinkedInProfile(value);
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