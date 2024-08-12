import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, CardActions, Chip } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location?: string;
  immigrationSalaryList?: boolean;
}

interface SavedJobsProps {
  savedJobs: SavedJob[];
  handleCardClick: (jobId: number, company: string) => void;
}

const SavedJobs: React.FC<SavedJobsProps> = ({ savedJobs = [], handleCardClick }) => (
  <Box>
    <Typography variant="h6" mb={2}>Saved Jobs</Typography>
    {savedJobs.length > 0 ? (
      <Grid container spacing={2}>
        {savedJobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => handleCardClick(job.id, job.company)}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" style={{ marginBottom: '8px' }}>
                  {job.title}
                </Typography>
                <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                  {job.company}
                </Typography>
                {job.location && (
                  <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                    {job.location}
                  </Typography>
                )}
                {job.immigrationSalaryList && (
                  <Chip label="Immigration Salary List" color="primary" style={{ marginBottom: '8px' }} />
                )}
              </CardContent>
              <CardActions sx={{ marginTop: 'auto' }}>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body2">No saved jobs found.</Typography>
    )}
  </Box>
);

export default SavedJobs;