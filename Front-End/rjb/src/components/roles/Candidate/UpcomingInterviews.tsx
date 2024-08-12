import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../globalState/globalState';
import { CardContent, Typography, Grid, Box, Avatar } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import StatusIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';

const UpcomingInterviews: React.FC = () => {
  const { email, username } = useGlobalState();
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getCandidateUpcomingInterviews/?email=${email}&username=${username}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, [email, username]);

  const InterviewCard: React.FC<{ interview: any }> = ({ interview }) => (
    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 1, position: 'relative' }}>
      {interview.company_logo && (
        <Avatar
          alt={interview.company_name}
          src={`data:image/png;base64,${interview.company_logo}`}
          sx={{ width: 150, height: 150, position: 'absolute', top: 16, right: 16 }}
        />
      )}
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {interview.interview_type.toUpperCase()} INTERVIEW
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <WorkIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Job Title:</Typography>
            <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.job_title}</Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Company Name:</strong></Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.company_name}</Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Company Email:</strong></Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.company_email}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1}>
                <EventIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Date:</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{new Date(interview.date).toLocaleDateString()}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Start Time:</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{new Date(`1970-01-01T${interview.start_time}`).toLocaleTimeString()}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>End Time:</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{new Date(`1970-01-01T${interview.end_time}`).toLocaleTimeString()}</Typography>
              </Box>
            </Grid>
            {interview.interview_type === 'in-person' && (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Location:</Typography>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.interview_location}</Typography>
                </Box>
              </Grid>
            )}
            {interview.interview_type === 'virtual' && (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  <LinkIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Meeting Link:</Typography>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                    <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a>
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1}>
                <NotesIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Additional Details:</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.additional_details}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1}>
                <StatusIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Status:</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{interview.status}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Box>
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Upcoming Interviews
      </Typography>
      {interviews.length > 0 ? (
        interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))
      ) : (
        <Typography>No upcoming interviews found.</Typography>
      )}
    </div>
  );
};

export default UpcomingInterviews;