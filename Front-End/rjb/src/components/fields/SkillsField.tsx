import React from 'react';
import { TextField, Autocomplete, Chip } from '@mui/material';

interface Props {
  value: string[];
  onChange: (event: any, value: string[]) => void;
  error?: string;
  availableSkills: string[];
  label?: string;  // Optional label prop
}

const SkillsField: React.FC<Props> = ({ value, onChange, error, availableSkills, label = "Skills" }) => {
  return (
    <Autocomplete
      multiple
      options={availableSkills}
      getOptionLabel={(option) => option}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}  // Use the label prop
          name="skills"
          placeholder="Select skills"
          error={!!error}
          helperText={error || ''}
          sx={{ mb: 2 }}
        />
      )}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
    />
  );
};

export default SkillsField;