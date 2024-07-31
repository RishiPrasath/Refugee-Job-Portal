import React from 'react';
import { Box, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FeedbackIcon from '@mui/icons-material/Feedback';
import WorkIcon from '@mui/icons-material/Work';

interface Interview {
  id: number;
  interview_type: string;
  date: string;
  start_time: string;
  end_time: string;
  interview_location: string;
  meeting_link: string;
  additional_details: string;
  status: string;
  feedback: string;
  job_title: string;
  candidate_full_name: string;
  candidate_phone: string;
  candidate_email: string;
}

const InterviewCard: React.FC<{ interview: Interview }> = ({ interview }) => {
  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 1 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Date:</Typography>
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.date}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <AccessTimeIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Time:</Typography>
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.start_time} - {interview.end_time}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <LocationOnIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Location:</Typography>
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.interview_location}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <LinkIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Meeting Link:</Typography>
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
            <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <InfoIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Additional Details:</Typography>
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.additional_details}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <CheckCircleIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Status:</Typography>
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.status}</Typography>
        </Box>
        {interview.feedback && (
          <Box display="flex" alignItems="center">
            <FeedbackIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Feedback:</Typography>
            <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.feedback}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InterviewCard;