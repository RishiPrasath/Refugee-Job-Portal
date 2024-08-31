import React from 'react';
import { Box, Typography, Grid, Avatar, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../../globalState/globalState';

interface ProfileProps {
  employerData: any;
}

const Profile: React.FC<ProfileProps> = ({ employerData }) => {
  const { userID } = useGlobalState();
  const navigate = useNavigate();

  const handleChatClick = async () => {
    try {
      // Get employer user ID
      const response = await fetch(`http://localhost:8000/chats/get_user_id/${employerData.email}/`);
      if (!response.ok) {
        throw new Error('Failed to get employer user ID');
      }
      const { user_id: employerUserID } = await response.json();

      // Get or create chat group
      const chatResponse = await fetch(`http://localhost:8000/chats/get_or_create_chat/${userID}/${employerUserID}/`);
      if (!chatResponse.ok) {
        throw new Error('Failed to get or create chat group');
      }
      const { chat_group_id: chatGroupID } = await chatResponse.json();

      // Navigate to chat page
      navigate(`/chat/${chatGroupID}`);
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
        <Avatar
          alt={employerData.company_name}
          src={employerData.logo_url}
          sx={{ width: 195, height: 195, marginBottom: 2 }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="h5" mb={2}>{employerData.company_name}</Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <BusinessIcon />
          <Typography variant="body1" ml={1}>{employerData.industry}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <EmailIcon />
          <Typography variant="body1" ml={1}>{employerData.email}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <PhoneIcon />
          <Typography variant="body1" ml={1}>{employerData.contact_phone}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <LocationOnIcon />
          <Typography variant="body1" ml={1}>{employerData.location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <LanguageIcon />
          <Typography variant="body1" ml={1}>
            <a href={employerData.website_url} target="_blank" rel="noopener noreferrer">Website</a>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <InfoIcon />
          <Typography variant="body1" ml={1}>{employerData.description}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChatIcon />}
            onClick={handleChatClick}
          >
            Chat
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Profile;