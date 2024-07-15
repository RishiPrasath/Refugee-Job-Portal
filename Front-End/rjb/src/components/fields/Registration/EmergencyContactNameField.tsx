import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const EmergencyContactNameField: React.FC<Props> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      fullWidth
      label="Emergency Contact Name"
      name="emergency_contact_name"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error || ''}
      sx={{ mb: 2 }}
    />
  );
};

export default EmergencyContactNameField;