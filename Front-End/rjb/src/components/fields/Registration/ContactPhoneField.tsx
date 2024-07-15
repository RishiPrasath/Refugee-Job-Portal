import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ContactPhoneField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateContactPhone = (phone: string) => {
    if (!phone) return 'Contact phone number is required';
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) return 'Contact phone number must be a valid phone number';
    return '';
  };

  const handleBlur = () => {
    const validationError = validateContactPhone(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Contact Phone Number"
      name="contact_phone"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default ContactPhoneField;