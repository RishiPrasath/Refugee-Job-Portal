import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const WebsiteUrlField: React.FC<Props> = ({ value, onChange, error }) => {
  const validateUrl = (url: string) => {
    return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)?$/.test(url) ? '' : 'Must be a valid URL';
  };

  return (
    <TextField
      fullWidth
      label="Website URL"
      name="website_url"  // Ensure the name attribute is set
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || ''}
      onBlur={() => {
        const validationError = validateUrl(value);
        // Optionally set error state here if using local component state for errors
      }}
      sx={{ mb: 2 }}  // Add bottom margin
    />
  );
};

export default WebsiteUrlField;