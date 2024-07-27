import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface ActionButtonsProps {
  applicationId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ applicationId }) => {
  const navigate = useNavigate();

  const handleInterviewClick = () => {
    navigate(`/create-interview/${applicationId}`);
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