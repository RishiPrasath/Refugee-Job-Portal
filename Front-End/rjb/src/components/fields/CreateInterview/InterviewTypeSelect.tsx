import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface InterviewTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const InterviewTypeSelect: React.FC<InterviewTypeSelectProps> = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Interview Type</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Interview Type"
      >
        <MenuItem value="in-person">In-Person Interview</MenuItem>
        <MenuItem value="virtual">Virtual Interview</MenuItem>
      </Select>
    </FormControl>
  );
};

export default InterviewTypeSelect;