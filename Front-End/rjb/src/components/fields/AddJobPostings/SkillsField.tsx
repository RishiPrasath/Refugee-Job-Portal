import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

interface SkillsFieldProps {
  value: string[];
  onChange: (event: any, value: string[]) => void;
  availableSkills: string[];
  onBlur: () => void;
  error?: string;
}

const SkillsField: React.FC<SkillsFieldProps> = ({ value, onChange, availableSkills, onBlur, error }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        freeSolo // Allow users to enter custom skills
        options={availableSkills}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skills"
            margin="normal"
            fullWidth
            error={!!error}
            helperText={error}
          />
        )}
      />
    </Box>
  );
};

export default SkillsField;