import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const DateOfBirthField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateDateOfBirth = (date: string) => {
    return isNaN(Date.parse(date)) ? 'Date of birth must be a valid date' : '';
  };

  const handleBlur = () => {
    const validationError = validateDateOfBirth(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Date of Birth"
      type="date"
      name="date_of_birth"
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      sx={{ mb: 2 }}
    />
  );
};

export default DateOfBirthField;