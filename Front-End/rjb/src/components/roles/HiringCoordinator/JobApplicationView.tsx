import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import JobOfferComponent from './JobApplicationView/JobOfferComponent';
import ApplicationCard from './JobApplicationView/ApplicationCard';
import CandidateProfileSection from './JobApplicationView/CandidateProfileSection';
import InterviewCard from './JobApplicationView/InterviewCard';

interface JobApplication {
  candidateProfile: {
    full_name: string;
    email: string;
    phone_number: string;
    profile_picture: string | null;
    linkedin_profile: string;
    github_profile: string;
    skills: string[];
  };
  application: {
    id: number;
    job_title: string;
    employer: string;
    application_status: string;
    cover_letter: string;
    cv_url: string;
    created_at: string;
  };
  interviews: Array<{
    id: number;
    interview_type: string;
    date: string;
    start_time: string;
    end_time: string;
    interview_location: string;
    meeting_link: string;
    additional_details: string;
    status: string;
    feedback: string | null;
  }>;
  jobOffer: {
    job_offer_document: string;
    additional_details: string;
    offer_datetime: string;
    status: string;
  } | null;
}

const JobApplicationView: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [jobApplication, setJobApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/coordinators/job_application_view/${applicationId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobApplication(data);
      } catch (err) {
        console.error('Error fetching application data:', err);
        setError('Failed to fetch application data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [applicationId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!jobApplication) {
    return <Typography variant="body1">Job application not found.</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Application View
      </Typography>
      <CandidateProfileSection profile={jobApplication.candidateProfile} />
      <ApplicationCard application={jobApplication.application} />
      <InterviewCard interviews={jobApplication.interviews} />
      {jobApplication.jobOffer && <JobOfferComponent jobOffer={jobApplication.jobOffer} />}
    </Box>
  );
};

export default JobApplicationView;