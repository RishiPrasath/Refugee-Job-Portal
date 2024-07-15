import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const AccessibilityRequirementsField: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <TextField
      fullWidth
      label="Accessibility Requirements"
      name="accessibility_requirements"
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || ''}
      sx={{ mb: 2, width: '130%', mx: 'auto' }}
      multiline
      rows={7}
    />
  );
};

export default AccessibilityRequirementsField;