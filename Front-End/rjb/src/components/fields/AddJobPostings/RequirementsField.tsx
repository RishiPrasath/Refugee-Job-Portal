import React from 'react';
import { Box, TextField, IconButton, Typography, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface RequirementsFieldProps {
  requirements: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  onBlur: (index: number, value: string) => void;
  error?: string;
}

const RequirementsField: React.FC<RequirementsFieldProps> = ({ requirements, onAdd, onRemove, onChange, onBlur, error }) => {
  const handleAddClick = () => {
    onAdd();
  };

  const handleRemoveClick = (index: number) => {
    onRemove(index);
  };

  const handleBlur = (index: number, value: string) => {
    onBlur(index, value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Requirements
      </Typography>
      {requirements.length === 0 && error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {requirements.map((requirement, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField
            label={`Requirement ${index + 1}`}
            value={requirement}
            onChange={(e) => onChange(index, e.target.value)}
            onBlur={() => handleBlur(index, requirement)}
            fullWidth
            margin="normal"
            error={!requirement}
            helperText={!requirement ? 'This field is required' : ''}
          />
          <IconButton onClick={() => handleRemoveClick(index)} aria-label="remove requirement">
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Box display="flex" justifyContent="center" mt={2}>
        <IconButton onClick={handleAddClick} aria-label="add requirement" color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      {/* {error && <Typography color="error">{error}</Typography>} */}
    </Box>
  );
};

export default RequirementsField;