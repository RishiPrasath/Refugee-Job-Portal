import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, CardActions } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

interface Job {
  id: number;
  job_title: string;
  company_name: string;
  status: string;
  date_time_applied: string;
}

interface AppliedJobsProps {
  appliedJobs: Job[];
  handleCardClick: (jobId: number, company: string) => void;
}

const AppliedJobs: React.FC<AppliedJobsProps> = ({ appliedJobs = [], handleCardClick }) => (
  appliedJobs.length > 0 ? (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <WorkIcon style={{ marginRight: '8px' }} /> Applied Job Postings
          </Typography>
          <Grid container spacing={2}>
            {appliedJobs.map((job, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => handleCardClick(job.id, job.company_name)}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" style={{ marginBottom: '8px' }}>
                      {job.job_title}
                    </Typography>
                    <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                      {job.company_name}
                    </Typography>
                    <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                      <strong>Status:</strong> {job.status}
                    </Typography>
                    <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                      <strong>Applied on:</strong> {new Date(job.date_time_applied).toLocaleDateString()} at {new Date(job.date_time_applied).toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ marginTop: 'auto' }}>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  ) : (
    <Box mt={3}>
      <Typography variant="body2">No applied jobs found.</Typography>
    </Box>
  )
);

export default AppliedJobs;