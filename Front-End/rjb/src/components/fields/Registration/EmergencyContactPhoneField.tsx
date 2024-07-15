import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const EmergencyContactPhoneField: React.FC<Props> = ({ value, onChange, onBlur, error }) => {
  return (
    <TextField
      fullWidth
      label="Emergency Contact Phone Number"
      name="emergency_contact_phone"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error || ''}
      sx={{ mb: 2 }}
    />
  );
};

export default EmergencyContactPhoneField;