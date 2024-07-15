import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import InfoIcon from '@mui/icons-material/Info';
import { useGlobalState } from '../../../globalState/globalState';

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
  const defaultJobDetails: JobDetails = {
    job_title: '',
    job_description: '',
    requirements: '',
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
  const { company, jobId } = useParams<{ company: string; jobId: string }>();
  const { email, username } = useGlobalState();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const url = `http://localhost:8000/candidates/viewJobDetails/${company}/${jobId}`;
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

    const checkIfJobIsSaved = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getSavedJobs?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        const savedJobs = await response.json();
        console.log("Saved Jobs:", savedJobs);
        if (response.ok) {
          const isJobSaved = savedJobs.some((job: { id: number }) => job.id === parseInt(jobId || '0'));
          setIsSaved(isJobSaved);
        } else {
          console.error('Failed to fetch saved jobs:', savedJobs.error);
        }
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
      }
    };

    fetchJobDetails();
    checkIfJobIsSaved();
  }, [company, jobId, email, username]);

  const handleSaveJob = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/saveJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          job_title: jobDetails.job_title,
          company_name: company,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSaved(true);
      } else {
        console.error('Failed to save job:', data.error);
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleRemoveJob = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/removeSavedJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          job_title: jobDetails.job_title,
          company_name: company,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSaved(false);
      } else {
        console.error('Failed to remove job:', data.error);
      }
    } catch (error) {
      console.error('Failed to remove job:', error);
    }
  };

  const requirementsList = jobDetails.requirements
    ? jobDetails.requirements.split('|').filter(req => req.trim() !== '')
    : [];

  const JobDescription: React.FC = () => (
    <Grid item xs={12}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        {jobDetails.job_title}
      </Typography>
      <Box display="flex" alignItems="flex-start">
        <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, mt: 0.5 }} />
        <Typography variant="body1" paragraph>
          {jobDetails.job_description}
        </Typography>
      </Box>
    </Grid>
  );

  const JobActions: React.FC = () => (
    <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
      <Button variant="contained" color="primary" sx={{ mr: 2, px: 4, py: 1.5 }}>
        Apply for Job
      </Button>
      <Button
        variant={isSaved ? 'contained' : 'outlined'}
        color="primary"
        sx={{ px: 4, py: 1.5 }}
        onClick={isSaved ? handleRemoveJob : handleSaveJob}
      >
        {isSaved ? 'Remove' : 'Save'}
      </Button>
    </Grid>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Posting Details
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <JobDescription />
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
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
            <JobActions />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default JobPosting;