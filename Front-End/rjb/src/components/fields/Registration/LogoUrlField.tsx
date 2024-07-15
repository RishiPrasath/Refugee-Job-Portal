import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const LogoUrlField: React.FC<Props> = ({ value, onChange, error }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(event); // Pass the event to the parent component
    }
  };

  return (
    <TextField
      fullWidth
      type="file"
      label="Upload Logo"
      name="logo"  // Ensure the name attribute is 'logo'
      onChange={handleFileChange}
      error={!!error}
      helperText={error || 'Upload your company logo'}
      sx={{ mb: 2 }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

export default LogoUrlField;