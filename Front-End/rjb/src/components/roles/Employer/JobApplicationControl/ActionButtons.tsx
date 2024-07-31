import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface ActionButtonsProps {
  applicationId: string;
  onReject: () => void; // New prop for handling rejection
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ applicationId, onReject }) => {
  const navigate = useNavigate();

  const handleInterviewClick = () => {
    navigate(`/create-interview/${applicationId}`);
  };

  const handleApproveClick = () => {
    navigate(`/joboffer/${applicationId}`);
  };

  const handleRejectClick = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/rejectApplication/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_id: applicationId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Application rejected successfully');
        onReject(); // Call the onReject callback
      } else {
        const errorData = await response.json();
        console.error('Error rejecting application:', errorData);
        alert('An error occurred while rejecting the application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('An error occurred while rejecting the application');
    }
  };

  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom>Actions</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            fullWidth
            sx={{ borderRadius: '20px' }}
            onClick={handleApproveClick}
          >
            Approve
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            fullWidth
            sx={{ borderRadius: '20px' }}
            onClick={handleRejectClick}
          >
            Reject
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalendarTodayIcon />}
            fullWidth
            sx={{ borderRadius: '20px' }}
            onClick={handleInterviewClick}
          >
            Interview
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActionButtons;