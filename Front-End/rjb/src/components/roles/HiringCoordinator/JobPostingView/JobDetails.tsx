import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';

interface JobPosting {
  id: number;
  job_title: string;
  job_description: string;
  location: string;
  compensation_amount: number;
  compensation_type: string;
  job_type: string;
  employment_term: string;
  status: string;
  ISL: boolean;
  skills: string[];
  requirements: string;
  employer: {
    company_name: string;
    logo_url: string | null;
  };
}

interface JobDetailsProps {
  jobPosting: JobPosting;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobPosting }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <LocationOnIcon sx={{ verticalAlign: 'middle' }} /> <strong>Location:</strong> {jobPosting.location}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <CurrencyPoundIcon sx={{ verticalAlign: 'middle' }} /> <strong>Compensation:</strong> £{jobPosting.compensation_amount} ({jobPosting.compensation_type})
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <WorkIcon sx={{ verticalAlign: 'middle' }} /> <strong>Job Type:</strong> {jobPosting.job_type}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Employment Term:</strong> {jobPosting.employment_term}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Status:</strong> {jobPosting.status}
            </Typography>
          </Grid>
          {jobPosting.ISL && (
            <Grid item xs={12}>
              <Chip sx={{ backgroundColor: 'purple', color: 'white' }} label="Immigration Salary List" />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Skills:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {jobPosting.skills.map((skill, index) => (
                <Chip key={index} label={skill} sx={{ backgroundColor: 'green', color: 'white' }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description:
            </Typography>
            <Typography variant="body1">
              {jobPosting.job_description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Requirements:
            </Typography>
            <ul>
              {jobPosting.requirements.split('|').map((requirement, index) => (
                <li key={index}>
                  <Typography variant="body1">{requirement.trim()}</Typography>
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobDetails;