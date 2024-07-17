import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../globalState/globalState';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';

interface JobPosting {
  job_title: string;
  location: string;
  job_type: string;
  compensation_amount: number;
  compensation_type: string;
  status: string;
  id: number; // Added id field
}

const ViewJobPostings: React.FC = () => {
  const navigate = useNavigate();
  const { username, company_name } = useGlobalState();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      const response = await fetch(`http://localhost:8000/employers/getJobPostings/?username=${username}&company_name=${company_name}`);
      const data = await response.json();
      if (response.ok) {
        console.log(data.job_postings);
        setJobPostings(data.job_postings);
      } else {
        console.error('Failed to fetch job postings:', data.error);
      }
    };

    fetchJobPostings();
  }, [username, company_name]);

  const handleAddJobPostings = () => {
    navigate('/addjobpostings');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        View Job Postings
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {jobPostings.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minWidth: 275 }} onClick={() => navigate(`/jobposting/${username}/${job.id}`)}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {job.job_title}
                </Typography>
                <Box display="flex" alignItems="center" mb={1.5}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography color="text.secondary">{job.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography color="text.secondary">{job.job_type}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CurrencyPoundIcon sx={{ mr: 1 }} />
                  <Typography color="text.secondary">{`${job.compensation_amount} (${job.compensation_type})`}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography color="text.secondary">{job.status}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={handleAddJobPostings} sx={{ mt: 2 }}>
        Add Job Postings
      </Button>
    </Box>
  );
};

export default ViewJobPostings;