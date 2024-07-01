import React from 'react';
import { Box, TextField, Button, Typography, Autocomplete, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { availableSkills } from '../../globals';

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  skills: string[];
  description: string;
}

interface Props {
  experience: WorkExperience;
  index: number;
  editIndex: number | null;
  handleEditExperience: (index: number, field: string, value: any) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleRemoveExperience: (index: number) => void;
  setEditIndex: (index: number) => void;
}

const WorkExperienceField: React.FC<Props> = ({
  experience,
  index,
  editIndex,
  handleEditExperience,
  handleSaveEdit,
  handleCancelEdit,
  handleRemoveExperience,
  setEditIndex
}) => {
  const years = Array.from({ length: 50 }, (_, index) => (new Date().getFullYear() - index).toString());

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.hasFocus()) {
        handleCancelEdit();
      }
    }, 200);
  };

  return (
    <Box onBlur={handleBlur} key={experience.id} sx={{ margin: '20px 0', border: '1px solid gray', padding: '20px', borderRadius: '8px', width: '100%' }}>
      {editIndex === index ? (
        <>
          <TextField
            label="Company"
            name="company"
            value={experience.company}
            onChange={(e) => handleEditExperience(index, 'company', e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Role"
            name="role"
            value={experience.role}
            onChange={(e) => handleEditExperience(index, 'role', e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="start-year-label">Start Year</InputLabel>
            <Select
              labelId="start-year-label"
              name="startYear"
              value={experience.startYear}
              onChange={(e) => handleEditExperience(index, 'startYear', e.target.value)}
              label="Start Year"
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="end-year-label">End Year</InputLabel>
            <Select
              labelId="end-year-label"
              name="endYear"
              value={experience.endYear}
              onChange={(e) => handleEditExperience(index, 'endYear', e.target.value)}
              label="End Year"
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            options={availableSkills}
            getOptionLabel={(option) => option}
            value={experience.skills}
            onChange={(e, newValue) => handleEditExperience(index, 'skills', newValue)}
            renderInput={(params) => <TextField {...params} label="Skills" name="skills" fullWidth margin="normal" sx={{ mb: 2 }} />}
          />
          <TextField
            label="Description"
            name="description"
            value={experience.description}
            onChange={(e) => handleEditExperience(index, 'description', e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />
          <Button onClick={handleSaveEdit} color="primary" variant="contained" sx={{ mt: 2, marginLeft: '20px' }}>Save</Button>
          <Button onClick={handleCancelEdit} color="secondary" variant="contained" sx={{ mt: 2, marginLeft: '20px' }}>Cancel</Button>
        </>
      ) : (
        <>
          <Typography variant="h6">{experience.company} - {experience.role}</Typography>
          <Typography variant="body2">{experience.startYear} - {experience.endYear}</Typography>
          <Typography variant="body2">{experience.skills.join(', ')}</Typography>
          <Typography variant="body2">{experience.description}</Typography>
          <Button onClick={() => setEditIndex(index)} color="primary" variant="contained" sx={{ mt: 2 }}>Edit</Button>
          <Button onClick={() => handleRemoveExperience(index)} color="secondary" variant="contained" sx={{ mt: 2, ml: 2 }}>Remove</Button>
        </>
      )}
    </Box>
  );
};

export default WorkExperienceField;