import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
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
  company_name: string;
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
    skills: [],
    company_name: ''
  };
  const [jobDetails, setJobDetails] = useState<JobDetails>(defaultJobDetails);
  const { company, jobId } = useParams<{ company: string; jobId: string }>();
  const { email, username, userID } = useGlobalState();
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false); // New state for application status
  const navigate = useNavigate();

  useEffect(() => {
    console.log("==============================================================");
    console.log("Company: ", company);
    console.log("Job ID: ", jobId);
    console.log("Email: ", email);
    console.log("Username: ", username);
    console.log("==============================================================");

    const fetchJobDetails = async () => {
      try {
        const url = `http://localhost:8000/candidates/viewJobDetails/${company}/${jobId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Job Details: ",data);
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

    const checkIfApplied = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/checkIfApplied?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&job_id=${jobId}`);
        const appliedJobs = await response.json();
        console.log("Applied Jobs:", appliedJobs);
        if (response.ok) {
          const hasApplied = appliedJobs.some((job: { id: number }) => job.id === parseInt(jobId || '0'));
          setHasApplied(hasApplied);
        } else {
          console.error('Failed to fetch applied jobs:', appliedJobs.error);
        }
      } catch (error) {
        console.error('Failed to fetch applied jobs:', error);
      }
    };

    fetchJobDetails();
    checkIfJobIsSaved();
    checkIfApplied(); // Check if the candidate has applied
  }, [company, jobId, email, username]);

  const handleApplyForJob = () => {
    navigate(`/applyForJob/${company}/${jobDetails.job_title}/${jobId}`);
  };

  const handleWithdrawApplication = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/withdrawApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, job_id: jobId, company_name: company, job_title: jobDetails.job_title }),
      });

      if (response.ok) {
        setHasApplied(false);
        console.log('Application withdrawn successfully');
      } else {
        console.error('Failed to withdraw application');
      }
    } catch (error) {
      console.error('Failed to withdraw application:', error);
    }
  };

  const handleSaveJob = async () => {
    try {
      const response = await fetch('http://localhost:8000/candidates/saveJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, job_title: jobDetails.job_title, company_name: company }),
      });

      if (response.ok) {
        setIsSaved(true);
      } else {
        console.error('Failed to save job');
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
        body: JSON.stringify({ email, username, job_title: jobDetails.job_title, company_name: company }),
      });

      if (response.ok) {
        setIsSaved(false);
      } else {
        console.error('Failed to remove saved job');
      }
    } catch (error) {
      console.error('Failed to remove saved job:', error);
    }
  };

  const handleChatClick = async () => {
    try {
      // Get employer user ID
      const response = await fetch(`http://localhost:8000/chats/get_user_id_via_company_name/${company}/`);
      if (!response.ok) {
        throw new Error('Failed to get employer user ID');
      }
      const { user_id: employerUserID } = await response.json();

      // Get or create chat group
      const chatResponse = await fetch(`http://localhost:8000/chats/get_or_create_chat/${userID}/${employerUserID}/`);
      if (!chatResponse.ok) {
        throw new Error('Failed to get or create chat group');
      }
      const { chat_group_id: chatGroupID } = await chatResponse.json();

      // Navigate to chat page
      navigate(`/chat/${chatGroupID}`);
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const JobActions: React.FC = () => (
    <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mr: 2, px: 4, py: 1.5 }}
        onClick={handleChatClick}
        startIcon={<ChatIcon />}
      >
        Chat with Employer
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ mr: 2, px: 4, py: 1.5 }}
        onClick={hasApplied ? handleWithdrawApplication : handleApplyForJob}
      >
        {hasApplied ? 'Withdraw Application' : 'Apply for Job'}
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
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Requirements:
              </Typography>
              <ul>
                {jobDetails.requirements.split('|').map((requirement, index) => (
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