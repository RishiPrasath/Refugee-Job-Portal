import React from 'react';
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { AccessTime, Event, LocationOn, Link, Info, CheckCircle, Feedback, Work, Business, Email } from '@mui/icons-material';

interface Interview {
  id: number;
  application_id: number;
  date: string;
  start_time: string;
  end_time: string;
  interview_location: string;
  meeting_link: string;
  additional_details: string;
  status: string;
  feedback: string | null;
  job_title: string;
  employer: string;
  interview_type: string;
  logo_url: string | null;
}

interface InterviewsProps {
  interviews: Interview[];
}

const Interviews: React.FC<InterviewsProps> = ({ interviews }) => {
  return (
    <Box mt={3}>
      {interviews.map(interview => (
        <Box key={interview.id} mb={2}>
          <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px', position: 'relative' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
                  {interview.interview_type.toUpperCase()} INTERVIEW
                </Typography>
                <Avatar
                  alt="Company Logo"
                  src={interview.logo_url || 'https://via.placeholder.com/150'}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Work style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Job Title:</strong> {interview.job_title}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Business style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Company Name:</strong> {interview.employer}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Email style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Company Email:</strong> hr@techcorp.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Event style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Date:</strong> {interview.date}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTime style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Start Time:</strong> {interview.start_time}</Typography>
                <AccessTime style={{ marginLeft: '16px', marginRight: '8px' }} />
                <Typography variant="body2"><strong>End Time:</strong> {interview.end_time}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Location:</strong> {interview.interview_location}</Typography>
              </Box>
              {interview.meeting_link && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Link style={{ marginRight: '8px' }} />
                  <Typography variant="body2"><strong>Meeting Link:</strong> <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a></Typography>
                </Box>
              )}
              <Box display="flex" alignItems="center" mb={1}>
                <Info style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Additional Details:</strong> {interview.additional_details}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircle style={{ marginRight: '8px' }} />
                <Typography variant="body2"><strong>Status:</strong> {interview.status}</Typography>
              </Box>
              {interview.feedback && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Feedback style={{ marginRight: '8px' }} />
                  <Typography variant="body2"><strong>Feedback:</strong> {interview.feedback}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default Interviews;