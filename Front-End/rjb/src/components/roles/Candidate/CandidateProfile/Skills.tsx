import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Button, TextField, Autocomplete, Chip } from '@mui/material';
import SkillIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGlobalState } from '../../../../globalState/globalState'; // Import global state

interface Skill {
  id: number;
  skill_name: string;
  description: string; // Added description property
}

interface SkillsProps {
  skills: Skill[];
  onSave: (updatedSkills: Skill[]) => void;
}

const Skills: React.FC<SkillsProps> = ({ skills, onSave }) => {
  const { username, email } = useGlobalState(); // Get username and email from global state
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkills, setEditedSkills] = useState<Skill[]>(skills);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/candidates/skills')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log('Skills: ', data);
        setAvailableSkills(data.map((skill: Skill) => skill.skill_name));
      })
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditedSkills(skills);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    console.log('Updated skills:', editedSkills);

    // Call the backend to update skills
    fetch('http://localhost:8000/candidates/updateSkills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        skills: editedSkills,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Skills updated successfully:', data);
        onSave(editedSkills); // Notify parent component
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating skills:', error);
      });
  };

  const handleSkillsChange = (event: any, value: string[]) => {
    const newSkills = value.map((skill_name, index) => ({ id: index, skill_name, description: '' })); // Added description
    setEditedSkills(newSkills);
  };

  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <SkillIcon style={{ marginRight: '8px' }} /> Skills
            {!isEditing && (
              <IconButton
                style={{ marginLeft: 'auto' }}
                onClick={handleEditClick}
              >
                <EditIcon />
              </IconButton>
            )}
          </Typography>
          {isEditing ? (
            <Autocomplete
              freeSolo
              multiple
              options={availableSkills}
              getOptionLabel={(option) => option}
              value={editedSkills.map(skill => skill.skill_name)}
              onChange={handleSkillsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  name="skills"
                  placeholder="Select skills"
                  sx={{ mb: 2 }}
                />
              )}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
            />
          ) : (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {skills.map(skill => (
                <Chip key={skill.id} label={skill.skill_name} style={{ backgroundColor: 'green', color: 'white' }} />
              ))}
            </Box>
          )}
          {isEditing && (
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
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Skills;