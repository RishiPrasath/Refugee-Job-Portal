import React from 'react';
import { Card, CardContent, Typography, List, ListItem, Button, Box, Grid, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WorkIcon from '@mui/icons-material/Work';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

// Define interface for the job details
interface JobPosting {
  job_id: number;
  job_title: string;
  company_name: string;
  job_description: string;
  requirements: string[];
  location: string;
  compensation_amount: number;
  compensation_type: string;
  employment_type: string;
  work_type: string;
  skills: string[];
}

interface Data {
  job: JobPosting;
}

// Sample data
const data: Data = {
  job: {
    job_id: 1,
    job_title: 'Biological Scientist',
    company_name: 'HealthTech Labs',
    job_description: 'We are seeking a dedicated Biological Scientist with experience in molecular biology and bioinformatics.',
    requirements: ['3+ years of experience', 'Proficiency in molecular biology techniques', 'Experience with bioinformatics tools'],
    location: 'Cambridge, UK',
    compensation_amount: 45000,
    compensation_type: 'per year',
    employment_type: 'Full-time',
    work_type: 'On-site',
    skills: ['Molecular Biology', 'Bioinformatics', 'Laboratory Management']
  }
};

const JobPostingDetails: React.FC = () => {
  const job = data.job;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Posting Details
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {job.job_title}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                <BusinessIcon sx={{ verticalAlign: 'middle' }} /> {job.company_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                <DescriptionIcon sx={{ verticalAlign: 'middle' }} /> {job.job_description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Requirements:
              </Typography>
              <List>
                {job.requirements.map((requirement, index) => (
                  <ListItem key={index}>
                    <Typography variant="body2">
                      {requirement}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <LocationOnIcon sx={{ verticalAlign: 'middle' }} /> <strong>Location:</strong> {job.location}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <MonetizationOnIcon sx={{ verticalAlign: 'middle' }} /> <strong>Compensation:</strong> £{job.compensation_amount} ({job.compensation_type})
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <WorkIcon sx={{ verticalAlign: 'middle' }} /> <strong>Employment Type:</strong> {job.employment_type}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <HomeWorkIcon sx={{ verticalAlign: 'middle' }} /> <strong>Work Type:</strong> {job.work_type}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {job.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button variant="contained" color="primary">
                Apply Now
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobPostingDetails;
