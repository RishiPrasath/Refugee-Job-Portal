import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface JobTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

const JobTypeField: React.FC<JobTypeFieldProps> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      label="Job Type"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      select
      fullWidth
      margin="normal"
    >
      <MenuItem value="Full-time">Full-time</MenuItem>
      <MenuItem value="Part-time">Part-time</MenuItem>
      <MenuItem value="Contract">Contract</MenuItem>
      <MenuItem value="Internship">Internship</MenuItem>
    </TextField>
  );
};

export default JobTypeField;
