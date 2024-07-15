import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  setErrorMessage: (message: string) => void;
}

const CompanyNameField: React.FC<Props> = ({ value, onChange, onBlur, error, setErrorMessage, ...otherProps }) => {
  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    if (!trimmedValue) {
      setErrorMessage('Company name is required');
    } else {
      setErrorMessage('');
    }
    onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateInput(e as React.ChangeEvent<HTMLInputElement>); // Simplified casting
    onBlur(e);
  };

  return (
    <TextField
      fullWidth
      label="Company Name"
      name="company_name"
      value={value}
      onChange={validateInput}
      onBlur={handleBlur}
      error={!!error}
      helperText={error || 'Please enter the company name.'} // Providing a default helper text
      required
      sx={{ mb: 2 }}
      {...otherProps} // Prop spreading for additional attributes
    />
  );
};

export default CompanyNameField;