import React from 'react';
import { TextField } from '@mui/material';

interface JobDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

const JobDescriptionField: React.FC<JobDescriptionFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Job Description"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      fullWidth
      margin="normal"
      multiline
      rows={4}
    />
  );
};

export default JobDescriptionField;
