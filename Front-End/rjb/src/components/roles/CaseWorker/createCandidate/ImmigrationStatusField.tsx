import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: string;
}

const ImmigrationStatusField: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel id="immigration-status-label">Immigration Status</InputLabel>
      <Select
        labelId="immigration-status-label"
        id="immigration-status"
        name="immigration_status" // Added this line
        value={value}
        label="Immigration Status"
        onChange={onChange}
      >
        <MenuItem value="Asylum Seeker">Asylum Seeker</MenuItem>
        <MenuItem value="Refugee">Refugee</MenuItem>
      </Select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </FormControl>
  );
};

export default ImmigrationStatusField;