import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface EmergencyContactPhoneFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const EmergencyContactPhoneField: React.FC<EmergencyContactPhoneFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validatePhone = (phone: string) => {
    // This regex allows for optional '+' at the start, followed by digits, spaces, and hyphens
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, '')) ? '' : 'Invalid phone number';
  };

  const handleBlur = () => {
    const validationError = validatePhone(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Emergency Contact Phone"
      name="emergency_contact_phone"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      placeholder="+44 7911 123456"
      sx={{ mb: 2 }}
    />
  );
};

export default EmergencyContactPhoneField;