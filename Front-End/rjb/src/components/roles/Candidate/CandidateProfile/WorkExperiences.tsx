import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Button, TextField, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobalState } from '../../../../globalState/globalState';

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  start_year: number;
  end_year: number;
  description: string;
}

interface WorkExperiencesProps {
  workExperiences: WorkExperience[];
  onSave: (updatedWorkExperiences: WorkExperience[]) => void;
}

const generateYears = (startYear: number, numYears: number) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: numYears }, (_, i) => currentYear - i);
};

const WorkExperienceCard: React.FC<{ experience: WorkExperience; onSave: (experience: WorkExperience) => void; onCancel: () => void; onDelete: () => void }> = ({ experience, onSave, onCancel, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperience, setEditedExperience] = useState<WorkExperience>(experience);
  const years = generateYears(new Date().getFullYear(), 50); // Generate the last 50 years

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditedExperience(experience);
    setIsEditing(false);
    onCancel();
  };

  const handleSaveClick = async () => {
    onSave(editedExperience);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditedExperience({ ...editedExperience, [name as string]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setEditedExperience({ ...editedExperience, [name as string]: value });
  };

  return (
    <Box key={experience.id} mb={2}>
      <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
          {isEditing ? (
            <>
              <TextField
                label="Company"
                name="company"
                value={editedExperience.company}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                name="role"
                value={editedExperience.role}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Select
                label="Start Year"
                name="start_year"
                value={editedExperience.start_year}
                onChange={handleSelectChange}
                fullWidth
                margin="dense"
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <Select
                label="End Year"
                name="end_year"
                value={editedExperience.end_year}
                onChange={handleSelectChange}
                fullWidth
                margin="dense"
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Description"
                name="description"
                value={editedExperience.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  style={{ marginRight: '8px' }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box display="flex" mb={1}>
                <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Company:</strong></Typography>
                <Typography variant="body2">{experience.company}</Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Role:</strong></Typography>
                <Typography variant="body2">{experience.role}</Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Years:</strong></Typography>
                <Typography variant="body2">{experience.start_year} - {experience.end_year}</Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Description:</strong></Typography>
                <Typography variant="body2">{experience.description}</Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const WorkExperiences: React.FC<WorkExperiencesProps> = ({ workExperiences, onSave }) => {
  const { username, email } = useGlobalState();
  const [editedWorkExperiences, setEditedWorkExperiences] = useState<WorkExperience[]>(workExperiences);
  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    id: 0,
    company: '',
    role: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear(),
    description: ''
  });

  const handleSaveExperience = async (updatedExperience: WorkExperience) => {
    const updatedWorkExperiences = editedWorkExperiences.map(experience =>
      experience.id === updatedExperience.id ? updatedExperience : experience
    );
    setEditedWorkExperiences(updatedWorkExperiences);
    onSave(updatedWorkExperiences);

    // Send the updated work experience to the backend
    try {
      const response = await fetch('http://localhost:8000/candidates/updateWorkExperiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          updatedExperience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update work experience');
      }

      const data = await response.json();
      console.log('Update response:', data);
    } catch (error) {
      console.error('Error updating work experience:', error);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    const updatedWorkExperiences = editedWorkExperiences.filter(experience => experience.id !== id);
    setEditedWorkExperiences(updatedWorkExperiences);
    onSave(updatedWorkExperiences);

    // Send the delete request to the backend
    try {
      const response = await fetch('http://localhost:8000/candidates/deleteWorkExperience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          experienceId: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete work experience');
      }

      const data = await response.json();
      console.log('Delete response:', data);
    } catch (error) {
      console.error('Error deleting work experience:', error);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSaveNewExperience = async () => {
    const updatedWorkExperiences = [...editedWorkExperiences, { ...newExperience, id: Date.now() }];
    setEditedWorkExperiences(updatedWorkExperiences);
    onSave(updatedWorkExperiences);

    // Send the new work experience to the backend
    try {
      const response = await fetch('http://localhost:8000/candidates/addWorkExperience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          newExperience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add work experience');
      }

      const data = await response.json();
      console.log('Add response:', data);
    } catch (error) {
      console.error('Error adding work experience:', error);
    }

    setIsAdding(false);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditedWorkExperiences(workExperiences);
  };

  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <WorkIcon style={{ marginRight: '8px' }} /> Work Experiences
          </Typography>
          {editedWorkExperiences.map(experience => (
            <WorkExperienceCard
              key={experience.id}
              experience={experience}
              onSave={handleSaveExperience}
              onCancel={handleCancelEdit}
              onDelete={() => handleDeleteExperience(experience.id)}
            />
          ))}
          {isAdding && (
            <Box mt={2}>
              <TextField
                label="Company"
                name="company"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                name="role"
                value={newExperience.role}
                onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Select
                label="Start Year"
                name="start_year"
                value={newExperience.start_year}
                onChange={(e) => setNewExperience({ ...newExperience, start_year: e.target.value as number })}
                fullWidth
                margin="dense"
              >
                {generateYears(new Date().getFullYear(), 50).map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <Select
                label="End Year"
                name="end_year"
                value={newExperience.end_year}
                onChange={(e) => setNewExperience({ ...newExperience, end_year: e.target.value as number })}
                fullWidth
                margin="dense"
              >
                {generateYears(new Date().getFullYear(), 50).map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Description"
                name="description"
                value={newExperience.description}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveNewExperience}
                  style={{ marginRight: '8px' }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelAdd}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add Work Experience
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WorkExperiences;