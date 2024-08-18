import React from 'react';
import { TextField } from '@mui/material';

interface AccessibilityRequirementsFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const AccessibilityRequirementsField: React.FC<AccessibilityRequirementsFieldProps> = ({ value, onChange, error }) => {
  return (
    <TextField
      label="Accessibility Requirements"
      name="accessibility_requirements"
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      fullWidth
      margin="normal"
      multiline
      rows={4}
    />
  );
};

export default AccessibilityRequirementsField;
