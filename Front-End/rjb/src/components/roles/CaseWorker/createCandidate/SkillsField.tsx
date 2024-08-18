import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

interface SkillsFieldProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
  availableSkills: string[];
}

const SkillsField: React.FC<SkillsFieldProps> = ({ value, onChange, error, availableSkills }) => {
  return (
    <Autocomplete
      multiple
      id="skills"
      options={availableSkills}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Skills"
          placeholder="Select skills"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};

export default SkillsField;