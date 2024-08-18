import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Autocomplete, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { availableSkills } from '../../../../globals'; // Adjust the path as needed

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  skills: string[];
  description: string;
}

interface WorkExperienceFieldProps {
  value: WorkExperience[];
  onChange: (workExperiences: WorkExperience[]) => void;
  error?: string;
}

const WorkExperienceField: React.FC<WorkExperienceFieldProps> = ({ value, onChange, error }) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const years = Array.from({ length: 50 }, (_, index) => (new Date().getFullYear() - index).toString());

  const handleAddWorkExperience = () => {
    onChange([...value, { id: Date.now(), company: '', role: '', startYear: '', endYear: '', skills: [], description: '' }]);
    setEditIndex(value.length);
  };

  const handleRemoveWorkExperience = (id: number) => {
    onChange(value.filter((we) => we.id !== id));
    setEditIndex(null);
  };

  const handleInputChange = (id: number, field: string, fieldValue: any) => {
    onChange(value.map((we) => (we.id === id ? { ...we, [field]: fieldValue } : we)));
  };

  const handleSaveEdit = () => {
    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.hasFocus()) {
        handleCancelEdit();
      }
    }, 200);
  };

  return (
    <Box onBlur={handleBlur}>
      <Typography variant="h6" gutterBottom>
        Work Experiences
      </Typography>
      {value.map((experience, index) => (
        <Box key={experience.id} sx={{ margin: '20px 0', border: '1px solid gray', padding: '20px', borderRadius: '8px', width: '100%' }}>
          {editIndex === index ? (
            <>
              <TextField
                label="Company"
                name="company"
                value={experience.company}
                onChange={(e) => handleInputChange(experience.id, 'company', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Role"
                name="role"
                value={experience.role}
                onChange={(e) => handleInputChange(experience.id, 'role', e.target.value)}
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
                  onChange={(e) => handleInputChange(experience.id, 'startYear', e.target.value)}
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
                  onChange={(e) => handleInputChange(experience.id, 'endYear', e.target.value)}
                  label="End Year"
                >
                  {years.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Autocomplete
                freeSolo
                multiple
                options={availableSkills}
                getOptionLabel={(option) => option}
                value={experience.skills}
                onChange={(e, newValue) => handleInputChange(experience.id, 'skills', newValue)}
                renderInput={(params) => <TextField {...params} label="Skills" name="skills" fullWidth margin="normal" sx={{ mb: 2 }} />}
              />
              <TextField
                label="Description"
                name="description"
                value={experience.description}
                onChange={(e) => handleInputChange(experience.id, 'description', e.target.value)}
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
              <Button onClick={() => handleRemoveWorkExperience(experience.id)} color="secondary" variant="contained" sx={{ mt: 2, ml: 2 }}>Remove</Button>
            </>
          )}
        </Box>
      ))}
      <Button onClick={handleAddWorkExperience} color="primary" variant="contained" sx={{ marginTop: 2, marginBottom: 3 }}>Add Work Experience</Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default WorkExperienceField;