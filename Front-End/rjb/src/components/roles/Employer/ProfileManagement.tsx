import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Button, TextField, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { useGlobalState } from '../../../globalState/globalState';

type Props = {}

const ProfileManagement = (props: Props) => {
  const { username, email } = useGlobalState();
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/employers/getProfile/?username=${username}&email=${email}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        console.log("Profile data: ",data);
        
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username, email]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/employers/updateProfile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          ...editedProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Profile update response:", data);

      setProfile(editedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="flex-end">
          {!editMode && (
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
            <Avatar
              alt={profile.company_name}
              src={profile.logo}
              sx={{ width: 195, height: 195, marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            {editMode ? (
              <TextField
                fullWidth
                name="company_name"
                label="Company Name"
                value={editedProfile.company_name}
                onChange={handleChange}
                margin="normal"
              />
            ) : (
              <Typography variant="h5" mb={2}>{profile.company_name}</Typography>
            )}
            <Box display="flex" alignItems="center" mb={2}>
              <BusinessIcon />
              {editMode ? (
                <TextField
                  fullWidth
                  name="industry"
                  label="Industry"
                  value={editedProfile.industry}
                  onChange={handleChange}
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" ml={1}>{profile.industry}</Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <EmailIcon />
              {editMode ? (
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" ml={1}>{profile.email}</Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon />
              {editMode ? (
                <TextField
                  fullWidth
                  name="contact_phone"
                  label="Phone"
                  value={editedProfile.contact_phone}
                  onChange={handleChange}
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" ml={1}>{profile.contact_phone}</Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOnIcon />
              {editMode ? (
                <TextField
                  fullWidth
                  name="location"
                  label="Location"
                  value={editedProfile.location}
                  onChange={handleChange}
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" ml={1}>{profile.location}</Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <LanguageIcon />
              {editMode ? (
                <TextField
                  fullWidth
                  name="website_url"
                  label="Website URL"
                  value={editedProfile.website_url}
                  onChange={handleChange}
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" ml={1}>
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer">Website</a>
                </Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <InfoIcon />
              {editMode ? (
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  value={editedProfile.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              ) : (
                <Typography variant="body1" ml={1}>{profile.description}</Typography>
              )}
            </Box>
            {editMode && (
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProfileManagement;