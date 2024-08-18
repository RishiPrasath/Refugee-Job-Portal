import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Select, MenuItem } from '@mui/material';

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  startYear: string;
  endYear: string;
}

interface QualificationsFieldProps {
  value: Qualification[];
  onChange: (qualifications: Qualification[]) => void;
  error?: string;
}

const QualificationsField: React.FC<QualificationsFieldProps> = ({ value, onChange, error }) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const years = Array.from({ length: 50 }, (_, index) => (new Date().getFullYear() - index).toString());

  const handleAddQualification = () => {
    onChange([...value, { id: Date.now(), school: '', qualification: '', startYear: '', endYear: '' }]);
    setEditIndex(value.length);
  };

  const handleRemoveQualification = (id: number) => {
    onChange(value.filter((q) => q.id !== id));
    setEditIndex(null);
  };

  const handleInputChange = (id: number, field: string, fieldValue: string) => {
    onChange(value.map((q) => (q.id === id ? { ...q, [field]: fieldValue } : q)));
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
        Qualifications
      </Typography>
      {value.map((qualification, index) => (
        <Box key={qualification.id} sx={{ margin: '20px 0', border: '1px solid gray', padding: '20px', borderRadius: '8px', width: '100%' }}>
          {editIndex === index ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="School"
                  name="school"
                  value={qualification.school}
                  onChange={(e) => handleInputChange(qualification.id, 'school', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Qualification"
                  name="qualification"
                  value={qualification.qualification}
                  onChange={(e) => handleInputChange(qualification.id, 'qualification', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }}
                />
                <Select
                  value={qualification.startYear}
                  onChange={(e) => handleInputChange(qualification.id, 'startYear', e.target.value)}
                  fullWidth
                  displayEmpty
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="" disabled>Select Start Year</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
                <Select
                  value={qualification.endYear}
                  onChange={(e) => handleInputChange(qualification.id, 'endYear', e.target.value)}
                  fullWidth
                  displayEmpty
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="" disabled>Select End Year</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
                <Button onClick={handleSaveEdit} color="primary" variant="contained" sx={{ marginRight: 2 }}>Save</Button>
                <Button onClick={handleCancelEdit} color="secondary" variant="contained">Cancel</Button>
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography variant="h6">{qualification.school} - {qualification.qualification}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>{qualification.startYear} - {qualification.endYear}</Typography>
              <Button onClick={() => setEditIndex(index)} color="primary" variant="contained" sx={{ marginRight: 2 }}>Edit</Button>
              <Button onClick={() => handleRemoveQualification(qualification.id)} color="secondary" variant="contained">Remove</Button>
            </>
          )}
        </Box>
      ))}
      <Button onClick={handleAddQualification} color="primary" variant="contained" sx={{ marginTop: 2, marginBottom: 3 }}>Add Qualification</Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default QualificationsField;