import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface ISLFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const ISLField: React.FC<ISLFieldProps> = ({ value, onChange }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />}
      label="Immigration Salary List (ISL)"
    />
  );
};

export default ISLField;
