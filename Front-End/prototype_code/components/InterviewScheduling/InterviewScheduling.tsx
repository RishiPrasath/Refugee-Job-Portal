import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RoomIcon from '@mui/icons-material/Room';

// Define interface for the interview details
interface InterviewDetails {
  interview_id: number;
  application_id: number;
  interviewer_id: number;
  scheduled_at: string;
  interview_location: string;
  interview_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  feedback: string;
}

interface Data {
  interviewDetails: InterviewDetails;
}

// Sample data
const data: Data = {
  interviewDetails: {
    interview_id: 1,
    application_id: 1,
    interviewer_id: 2,
    scheduled_at: '2024-06-05T09:00:00Z',
    interview_location: 'Zoom',
    interview_type: 'video',
    status: 'scheduled',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-02T12:00:00Z',
    feedback: ''
  }
};

const InterviewScheduling: React.FC = () => {
  const interview = data.interviewDetails;

  const handleConfirmAttendance = () => {
    // Handle confirm attendance logic here
    console.log('Attendance confirmed for interview:', interview.interview_id);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Interview Details
      </Typography>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon />
            <Box ml={1}>
              <Typography variant="h6">
                Scheduled Date & Time
              </Typography>
              <Typography variant="body1">
                {new Date(interview.scheduled_at).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <VideoCallIcon />
            <Box ml={1}>
              <Typography variant="h6">
                Interview Type
              </Typography>
              <Typography variant="body1">
                {interview.interview_type === 'video' ? 'Video' : 'In-Person'}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <RoomIcon />
            <Box ml={1}>
              <Typography variant="h6">
                Location
              </Typography>
              <Typography variant="body1">
                {interview.interview_location}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6">
              Status
            </Typography>
            <Box ml={1}>
              <Typography variant="body1">
                {interview.status}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
            onClick={handleConfirmAttendance}
          >
            Confirm Attendance
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InterviewScheduling;
