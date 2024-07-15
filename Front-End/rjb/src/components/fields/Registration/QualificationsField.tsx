import React from 'react';
import { Box, TextField, Button, Typography, Grid, Select, MenuItem } from '@mui/material';

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  startYear: string;
  endYear: string;
}

interface Props {
  qualifications: Qualification[];
  handleAddQualification: () => void;
  handleEditQualification: (index: number, field: string, value: any) => void;
  handleRemoveQualification: (index: number) => void;
  editIndex: number | null;
  setEditIndex: (index: number | null) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
}

const QualificationsField: React.FC<Props> = ({
  qualifications,
  handleAddQualification,
  handleEditQualification,
  handleRemoveQualification,
  editIndex,
  setEditIndex,
  handleSaveEdit,
  handleCancelEdit
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
    <Box onBlur={handleBlur}>
      <Typography variant="h6" gutterBottom>
        Qualifications
      </Typography>
      {qualifications.map((qualification, index) => (
        <Box key={qualification.id} sx={{ margin: '20px 0', border: '1px solid gray', padding: '20px', borderRadius: '8px', width: '100%' }}>
          {editIndex === index ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="School"
                  name="school"
                  value={qualification.school}
                  onChange={(e) => handleEditQualification(index, 'school', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Qualification"
                  name="qualification"
                  value={qualification.qualification}
                  onChange={(e) => handleEditQualification(index, 'qualification', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }}
                />
                <Select
                  value={qualification.startYear}
                  onChange={(e) => handleEditQualification(index, 'startYear', e.target.value)}
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
                  onChange={(e) => handleEditQualification(index, 'endYear', e.target.value)}
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
              <Button onClick={() => handleRemoveQualification(index)} color="secondary" variant="contained">Remove</Button>
            </>
          )}
        </Box>
      ))}
      <Button onClick={handleAddQualification} color="primary" variant="contained" sx={{ marginTop: 2, marginBottom: 3 }}>Add Qualification</Button>
    </Box>
  );
};

export default QualificationsField;