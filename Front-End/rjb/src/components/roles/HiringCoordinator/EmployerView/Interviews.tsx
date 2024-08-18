import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid } from '@mui/material';
import { AccessTime, Event, LocationOn, Link, Info, CheckCircle, Feedback, Work, Business, Email, Phone } from '@mui/icons-material';

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
  feedback: string | null;
  job_title: string;
  candidate_full_name: string;
  candidate_phone: string;
  candidate_email: string;
  candidate_profile_pic: string | null;
}

interface InterviewsProps {
  interviews: Interview[];
}

const Interviews: React.FC<InterviewsProps> = ({ interviews }) => {
  // Sort interviews by date, start time, and end time in descending order
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time}`);
    const dateB = new Date(`${b.date}T${b.start_time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Box mt={3}>
      <Grid container spacing={2}>
        {sortedInterviews.map(interview => (
          <Grid item xs={12} sm={6} key={interview.id}>
            <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
                    {interview.interview_type ? interview.interview_type.toUpperCase() : 'INTERVIEW'}
                  </Typography>
                  <Avatar
                    alt="Candidate Profile Picture"
                    src={interview.candidate_profile_pic || 'https://via.placeholder.com/150'}
                    sx={{ width: 100, height: 100 }}
                  />
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Work style={{ marginRight: '8px' }} />
                  <Typography variant="body2"><strong>Job Title:</strong> {interview.job_title}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Business style={{ marginRight: '8px' }} />
                  <Typography variant="body2"><strong>Candidate Name:</strong> {interview.candidate_full_name}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Email style={{ marginRight: '8px' }} />
                  <Typography variant="body2"><strong>Candidate Email:</strong> {interview.candidate_email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Phone style={{ marginRight: '8px' }} />
                  <Typography variant="body2"><strong>Candidate Phone:</strong> {interview.candidate_phone}</Typography>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Interviews;