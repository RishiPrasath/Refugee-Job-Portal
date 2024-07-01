import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';

interface JobPosting {
  job_id: number;
  job_title: string;
  location: string;
  compensation_amount: number;
  compensation_type: string;
}

interface Interview {
  interview_id: number;
  job_title: string;
  scheduled_at: string;
  interview_location: string;
  interview_type: string;
}

interface Data {
  recommendedJobPostings: JobPosting[];
  upcomingInterviews: Interview[];
}

// Sample data
const data: Data = {
  recommendedJobPostings: [
    { job_id: 1, job_title: 'Software Developer', location: 'London', compensation_amount: 40000, compensation_type: 'per_hr' },
    { job_id: 2, job_title: 'Data Analyst', location: 'Manchester', compensation_amount: 35000, compensation_type: 'monthly' }
  ],
  upcomingInterviews: [
    { interview_id: 1, job_title: 'Data Analyst', scheduled_at: '2024-06-05T09:00:00Z', interview_location: 'Zoom', interview_type: 'video' },
    { interview_id: 2, job_title: 'Software Developer', scheduled_at: '2024-06-06T11:00:00Z', interview_location: 'Office', interview_type: 'in-person' }
  ]
};

const Home: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Recommended Job Postings
      </Typography>
      <Grid container spacing={3}>
        {data.recommendedJobPostings.map((job) => (
          <Grid item xs={12} md={6} key={job.job_id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{job.job_title}</Typography>
                <Typography variant="body2">{job.location}</Typography>
                <Typography variant="body2">
                  Compensation: {job.compensation_amount} ({job.compensation_type})
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Upcoming Interviews
        </Typography>
        <Grid container spacing={3}>
          {data.upcomingInterviews.map((interview) => (
            <Grid item xs={12} md={6} key={interview.interview_id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{interview.job_title}</Typography>
                  <Typography variant="body2">
                    Scheduled at: {new Date(interview.scheduled_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Location: {interview.interview_location}</Typography>
                  <Typography variant="body2">Type: {interview.interview_type}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
