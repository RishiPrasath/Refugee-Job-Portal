import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../globalState/globalState';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import StatusIcon from '@mui/icons-material/CheckCircle';

const UpcomingInterviews: React.FC = () => {
  const { email, company_name } = useGlobalState();
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(`http://localhost:8000/employers/getUpcomingInterviews/?email=${email}&company_name=${company_name}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setInterviews(data.interviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, [email, company_name]);

  const InterviewCard: React.FC<{ interview: any }> = ({ interview }) => (
    <Card style={{ margin: '3%', marginBottom: '1rem', padding: '0.5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {interview.interview_type.toUpperCase()} INTERVIEW
        </Typography>
        <Grid container spacing={2.4}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1.2}>
              <EventIcon style={{ marginRight: '0.6rem' }} />
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Date</Typography>
            </Box>
            <Typography variant="body2">{interview.date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" mb={1.2}>
              <AccessTimeIcon style={{ marginRight: '0.6rem' }} />
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Start Time</Typography>
            </Box>
            <Typography variant="body2">{interview.start_time}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" mb={1.2}>
              <AccessTimeIcon style={{ marginRight: '0.6rem' }} />
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>End Time</Typography>
            </Box>
            <Typography variant="body2">{interview.end_time}</Typography>
          </Grid>
          {interview.interview_type === 'in-person' && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1.2}>
                <LocationOnIcon style={{ marginRight: '0.6rem' }} />
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Location</Typography>
              </Box>
              <Typography variant="body2">{interview.interview_location}</Typography>
            </Grid>
          )}
          {interview.interview_type === 'virtual' && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1.2}>
                <LinkIcon style={{ marginRight: '0.6rem' }} />
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Meeting Link</Typography>
              </Box>
              <Typography variant="body2">{interview.meeting_link}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1.2}>
              <NotesIcon style={{ marginRight: '0.6rem' }} />
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Additional Details</Typography>
            </Box>
            <Typography variant="body2">{interview.additional_details}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1.2}>
              <StatusIcon style={{ marginRight: '0.6rem' }} />
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Status</Typography>
            </Box>
            <Typography variant="body2">{interview.status}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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