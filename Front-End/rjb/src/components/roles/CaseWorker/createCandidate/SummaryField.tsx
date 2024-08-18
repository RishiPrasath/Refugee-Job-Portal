import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface SummaryFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const SummaryField: React.FC<SummaryFieldProps> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateSummary = (summary: string) => {
    return summary ? '' : 'Summary is required';
  };

  const handleBlur = () => {
    const validationError = validateSummary(value);
    setLocalError(validationError);
  };

  return (
    <TextField
      fullWidth
      label="Summary"
      name="summary"
      value={value}
      onChange={onChange}
      error={!!localError}
      helperText={localError || ''}
      onBlur={handleBlur}
      multiline
      rows={4}
      sx={{ mb: 2 }}
    />
  );
};

export default SummaryField;