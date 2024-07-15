import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../../globalState/globalState';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import InfoIcon from '@mui/icons-material/Info';

// Define an interface for the job details
interface JobDetails {
  job_title: string;
  job_description: string;
  requirements: string;
  location: string;
  compensation_amount: number;
  compensation_type: string;
  job_type: string;
  employment_term: string;
  status: string;
  ISL: boolean;
  skills: string[];
}

const JobPosting: React.FC = () => {
  // Initialize jobDetails with default values that match the JobDetails interface
  const defaultJobDetails: JobDetails = {
    job_title: '',
    job_description: '',
    requirements: '',  // Ensure this is a string to avoid undefined issues
    location: '',
    compensation_amount: 0,
    compensation_type: '',
    job_type: '',
    employment_term: '',
    status: '',
    ISL: false,
    skills: []
  };
  const [jobDetails, setJobDetails] = useState<JobDetails>(defaultJobDetails);
  const { jobId } = useParams<{ jobId: string }>(); // Removed username from here
  const { username } = useGlobalState(); // Continue using username from global state
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const url = `http://localhost:8000/employers/getJobDetails/${jobId}/${username}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setJobDetails(data.job_details);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId, username]);

  // Split the requirements string into an array, only if it exists
  const requirementsList = jobDetails.requirements
    ? jobDetails.requirements.split('|').filter(req => req.trim() !== '')
    : [];

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
                {jobDetails.job_title}
              </Typography>
              <Box display="flex" alignItems="center">
                <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                <Typography variant="body1" paragraph>
                  {jobDetails.job_description}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Requirements:
              </Typography>
              <ul>
                {requirementsList.map((requirement, index) => (
                  <li key={index}>
                    <Typography variant="body1">{requirement.trim()}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <LocationOnIcon sx={{ verticalAlign: 'middle' }} /> <strong>Location:</strong> {jobDetails.location}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <CurrencyPoundIcon sx={{ verticalAlign: 'middle' }} /> <strong>Compensation:</strong> £{jobDetails.compensation_amount} ({jobDetails.compensation_type})
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <WorkIcon sx={{ verticalAlign: 'middle' }} /> <strong>Job Type:</strong> {jobDetails.job_type}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Employment Term:</strong> {jobDetails.employment_term}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Status:</strong> {jobDetails.status}
              </Typography>
            </Grid>
            {jobDetails.ISL && (
              <Grid item xs={12}>
                <Chip color="primary" label="Immigration Salary List" />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {jobDetails.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default JobPosting;