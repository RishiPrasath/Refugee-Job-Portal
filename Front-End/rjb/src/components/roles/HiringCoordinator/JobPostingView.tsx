import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import JobDetails from './JobPostingView/JobDetails';
import Applicants from './JobPostingView/Applicants';

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
  applicants: Applicant[];
}

interface Applicant {
  id: number;
  full_name: string;
  email: string;
  skills: string[];
  phone_number: string;
  profile_picture: string | null;
  status: string;
}

const JobPostingView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await fetch(`http://localhost:8000/coordinators/job_posting_view/${jobId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobPosting(data);
        console.log(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosting();
  }, [jobId]);

  const handleCardClick = (applicant: Applicant) => {
    navigate(`/jobapplication-view/${applicant.id}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  if (!jobPosting) {
    return <Typography variant="body1">Job posting not found.</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {jobPosting.job_title}
      </Typography>
      <JobDetails jobPosting={jobPosting} />
      <Typography variant="h4" gutterBottom mt={4}>
        Job Applicants
      </Typography>
      <Applicants applicants={jobPosting.applicants} onCardClick={handleCardClick} />
    </Box>
  );
};

export default JobPostingView;