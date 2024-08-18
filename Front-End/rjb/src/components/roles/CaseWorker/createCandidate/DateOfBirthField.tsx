import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface DateOfBirthFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const DateOfBirthField: React.FC<DateOfBirthFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateDate = (date: string) => {
    return date ? '' : 'Date of birth is required';
  };

  const handleBlur = () => {
    const validationError = validateDate(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Date of Birth"
      type="date"
      name="date_of_birth"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      InputLabelProps={{
        shrink: true,
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default DateOfBirthField;