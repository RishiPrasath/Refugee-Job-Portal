import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { useGlobalState } from '../../../../globalState/globalState';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';


interface Caseworker {
  full_name: string;
  email: string;
}

interface CaseworkerDetailsProps {
  caseworker: Caseworker | null;
}

const CaseworkerDetails: React.FC<CaseworkerDetailsProps> = ({ caseworker }) => {
  const { userID } = useGlobalState();
  const navigate = useNavigate();

  const handleChatClick = async () => {
    if (!caseworker) return;

    try {
      // Get caseworker user ID
      const response = await fetch(`http://localhost:8000/chats/get_user_id/${caseworker.email}/`);
      if (!response.ok) {
        throw new Error('Failed to get caseworker user ID');
      }
      const { user_id: caseworkerUserID } = await response.json();

      // Get or create chat group
      const chatResponse = await fetch(`http://localhost:8000/chats/get_or_create_chat/${userID}/${caseworkerUserID}/`);
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
    caseworker && (
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <ContactEmergencyIcon style={{ marginRight: '8px' }} /> Caseworker Details
            </Typography>
            <Typography variant="body1"><strong>Full Name:</strong> {caseworker.full_name}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {caseworker.email}</Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChatClick}
                startIcon={<ChatIcon />}
              >
                Chat 
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  );
};

export default CaseworkerDetails;