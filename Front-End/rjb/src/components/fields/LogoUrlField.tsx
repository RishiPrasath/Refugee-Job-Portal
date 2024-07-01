import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const LogoUrlField: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <TextField
      fullWidth
      type="file"  // Change type to file
      label="Upload Logo"
      name="logo_url"
      onChange={onChange}
      error={!!error}
      helperText={error || 'Upload your company logo'}
      sx={{ mb: 2 }}
      InputLabelProps={{
        shrink: true,  // This ensures the label doesn't overlap with the file name
      }}
    />
  );
};

export default LogoUrlField;