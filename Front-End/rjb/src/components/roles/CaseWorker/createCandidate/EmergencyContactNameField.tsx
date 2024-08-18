import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface EmergencyContactNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const EmergencyContactNameField: React.FC<EmergencyContactNameFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateName = (name: string) => {
    return name ? '' : 'Emergency contact name is required';
  };

  const handleBlur = () => {
    const validationError = validateName(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Emergency Contact Name"
      name="emergency_contact_name"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default EmergencyContactNameField;