import React from 'react';
import { TextField } from '@mui/material';

interface JobTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

const JobTitleField: React.FC<JobTitleFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Job Title"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      fullWidth
      margin="normal"
    />
  );
};

export default JobTitleField;
