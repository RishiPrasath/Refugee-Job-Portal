import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Button, TextField, TextFieldProps, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import { useGlobalState } from '../../../../globalState/globalState';

interface Profile {
  full_name: string;
  email: string;
  contact_phone: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  linkedin_profile: string;
  github_profile: string;
  immigration_status: string;
  accessibility_requirements: string | null;
  profile_picture: string | null;
  summary: string;
  caseworker: {
    full_name: string;
    email: string;
  } | null;
  skills: { id: number; skill_name: string; description: string }[];
  qualifications: { id: number; school: string; qualification: string; start_year: number; end_year: number }[];
  workExperiences: { id: number; company: string; role: string; start_year: number; end_year: number; description: string }[];
  savedJobs: { id: number; title: string; company: string; location?: string; immigrationSalaryList?: boolean }[];
  appliedJobs: {
    id: number;
    job_title: string;
    company_name: string;
    status: string;
    date_time_applied: string;
  }[];
}

interface ProfileHeaderProps {
  profile: Profile;
  isEditing: boolean;
  onSave: (updatedProfile: Profile) => void;
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isEditing, onSave, onEdit }) => {
  const { username, email } = useGlobalState();
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);

  useEffect(() => {
    console.log('Profile data in ProfileHeader:', profile);
  }, [profile]);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedProfile(profile);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          profile: editedProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      onSave(editedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditedProfile(profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleDateChange = (field: string) => (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const dateParts = editedProfile.date_of_birth.split('-');
    if (field === 'year') dateParts[0] = value;
    if (field === 'month') dateParts[1] = value.padStart(2, '0');
    if (field === 'day') dateParts[2] = value.padStart(2, '0');
    setEditedProfile({ ...editedProfile, date_of_birth: dateParts.join('-') });
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
            <Avatar
              alt={profile.full_name}
              src={profile.profile_picture ? `data:image/jpeg;base64,${profile.profile_picture}` : undefined}
              sx={{ width: 195, height: 195, marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            {editMode ? (
              <>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={editedProfile.full_name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Contact Phone"
                  name="contact_phone"
                  value={editedProfile.contact_phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Select
                    label="Day"
                    value={editedProfile.date_of_birth.split('-')[2]}
                    onChange={handleDateChange('day')}
                    fullWidth
                    margin="dense"
                  >
                    {Array.from({ length: 31 }, (_, day) => (
                      <MenuItem key={day + 1} value={String(day + 1).padStart(2, '0')}>
                        {String(day + 1).padStart(2, '0')}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    label="Month"
                    value={editedProfile.date_of_birth.split('-')[1]}
                    onChange={handleDateChange('month')}
                    fullWidth
                    margin="dense"
                  >
                    {Array.from({ length: 12 }, (_, month) => (
                      <MenuItem key={month + 1} value={String(month + 1).padStart(2, '0')}>
                        {String(month + 1).padStart(2, '0')}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    label="Year"
                    value={editedProfile.date_of_birth.split('-')[0]}
                    onChange={handleDateChange('year')}
                    fullWidth
                    margin="dense"
                  >
                    {Array.from({ length: 100 }, (_, year) => (
                      <MenuItem key={year + 1920} value={String(year + 1920)}>
                        {year + 1920}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <TextField
                  label="Emergency Contact Name"
                  name="emergency_contact_name"
                  value={editedProfile.emergency_contact_name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Emergency Contact Phone"
                  name="emergency_contact_phone"
                  value={editedProfile.emergency_contact_phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="LinkedIn Profile"
                  name="linkedin_profile"
                  value={editedProfile.linkedin_profile}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="GitHub Profile"
                  name="github_profile"
                  value={editedProfile.github_profile}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Immigration Status"
                  name="immigration_status"
                  value={editedProfile.immigration_status}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Summary"
                  name="summary"
                  value={editedProfile.summary}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button variant="contained" color="primary" onClick={handleSaveClick} sx={{ marginRight: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5" mb={2}>{profile.full_name}</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmailIcon />
                  <Typography variant="body1" ml={1}>{profile.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon />
                  <Typography variant="body1" ml={1}>{profile.contact_phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CakeIcon />
                  <Typography variant="body1" ml={1}>{profile.date_of_birth}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <ContactEmergencyIcon />
                  <Typography variant="body1" ml={1}>{profile.emergency_contact_name} ({profile.emergency_contact_phone})</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <LinkedInIcon />
                  <Typography variant="body1" ml={1}><a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer">LinkedIn</a></Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <GitHubIcon />
                  <Typography variant="body1" ml={1}><a href={profile.github_profile} target="_blank" rel="noopener noreferrer">GitHub</a></Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <InfoIcon />
                  <Typography variant="body1" ml={1} mr={1}>Immigration Status:</Typography>
                  <Chip label={profile.immigration_status} style={{ backgroundColor: 'purple', color: 'white' }} />
                </Box>
                <Typography variant="h6" mb={1}>Summary</Typography>
                <Typography variant="body1" mb={2}>{profile.summary}</Typography>
                <Button variant="contained" color="primary" onClick={handleEditClick}>
                  Edit
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;