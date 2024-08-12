import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Button, TextField, MenuItem } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useGlobalState } from '../../../../globalState/globalState';

interface Qualification {
  id: number; // Ensure this is unique
  school: string;
  qualification: string;
  start_year: number;
  end_year: number;
}

interface QualificationsProps {
  qualifications: Qualification[];
  onSave: (updatedQualifications: Qualification[]) => void;
  onAdd: (newQualification: Qualification) => void;
  onDelete: (qualificationId: number) => void;
}

const Qualifications: React.FC<QualificationsProps> = ({ qualifications, onSave, onAdd, onDelete }) => {
  const { username, email } = useGlobalState();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newQualification, setNewQualification] = useState<Qualification>({
    id: 0,
    school: '',
    qualification: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear(),
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, index) => currentYear - index);

  const handleAddQualification = () => {
    setIsFormVisible(true);
    setIsEditing(false);
    setNewQualification({ id: 0, school: '', qualification: '', start_year: currentYear, end_year: currentYear });
  };

  const handleEditQualification = (qualification: Qualification) => {
    setIsFormVisible(true);
    setIsEditing(true);
    setNewQualification(qualification);
  };

  const handleSaveQualification = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/addQualification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          newQualification,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add qualification');
      }

      const addedQualification = await response.json();
      onAdd(addedQualification);
      setIsFormVisible(false);
      setNewQualification({ id: 0, school: '', qualification: '', start_year: currentYear, end_year: currentYear });
    } catch (error) {
      console.error('Error adding qualification:', error);
    }
  };

  const handleUpdateQualification = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/updateQualification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          updatedQualification: newQualification,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update qualification');
      }

      const updatedQualification = await response.json();
      onSave(qualifications.map(q => (q.id === updatedQualification.id ? updatedQualification : q)));
      setIsFormVisible(false);
      setNewQualification({ id: 0, school: '', qualification: '', start_year: currentYear, end_year: currentYear });
    } catch (error) {
      console.error('Error updating qualification:', error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setNewQualification({ id: 0, school: '', qualification: '', start_year: currentYear, end_year: currentYear });
  };

  const handleDeleteQualification = async (qualificationId: number) => {
    try {
      const response = await fetch('http://localhost:8000/candidates/deleteQualification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          qualificationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete qualification');
      }

      onDelete(qualificationId);
    } catch (error) {
      console.error('Error deleting qualification:', error);
    }
  };

  const QualificationCard: React.FC<{ qualification: Qualification }> = ({ qualification }) => (
    <Box key={qualification.id} mb={2}>
      <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => handleEditQualification(qualification)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteQualification(qualification.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography variant="body1"><strong>{qualification.school}</strong></Typography>
          <Typography variant="body1">{qualification.qualification}</Typography>
          <Typography variant="body1">{qualification.start_year} - {qualification.end_year}</Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <SchoolIcon style={{ marginRight: '8px' }} /> Qualifications
          </Typography>
          {qualifications.map(qualification => (
            <QualificationCard key={qualification.id} qualification={qualification} />
          ))}
          {isFormVisible && (
            <Box mt={2}>
              <TextField
                label="School"
                value={newQualification.school}
                onChange={(e) => setNewQualification({ ...newQualification, school: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Qualification"
                value={newQualification.qualification}
                onChange={(e) => setNewQualification({ ...newQualification, qualification: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Start Year"
                value={newQualification.start_year}
                onChange={(e) => setNewQualification({ ...newQualification, start_year: Number(e.target.value) })}
                fullWidth
                margin="normal"
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="End Year"
                value={newQualification.end_year}
                onChange={(e) => setNewQualification({ ...newQualification, end_year: Number(e.target.value) })}
                fullWidth
                margin="normal"
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" onClick={isEditing ? handleUpdateQualification : handleSaveQualification}>
                  {isEditing ? 'Update' : 'Save'}
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
          {!isFormVisible && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddQualification}
              >
                Add Qualification
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Qualifications;