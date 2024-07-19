import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Avatar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../globalState/globalState';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SkillsIcon from '@mui/icons-material/Build'; // Assuming Build icon for skills
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Assuming AssignmentTurnedIn icon for status

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
  salary?: string; // Add this line if salary is needed
}

// Define default job details
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

interface ApplicationDetails {
  id: number;
  full_name: string;
  email: string;
  skills: string[];
  phone_number: string;
  profile_picture: string | null;
  status: string;
}

// JobDetailsCard component
const JobDetailsCard: React.FC<{ jobDetails: JobDetails }> = ({ jobDetails }) => {
  const requirementsList = jobDetails.requirements
    ? jobDetails.requirements.split('|').filter(req => req.trim() !== '')
    : [];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {jobDetails.job_title}
            </Typography>
            <Box display="flex" alignItems="flex-start">
              <InfoIcon sx={{ verticalAlign: 'top', mr: 1 }} />
              <Typography variant="body1" paragraph>
                {jobDetails.job_description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Requirements
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
            <Typography variant="body1" sx={{ mb: 1 }}>
              <LocationOnIcon sx={{ verticalAlign: 'middle' }} /> <strong>Location</strong>
            </Typography>
            <Typography variant="body1">
              {jobDetails.location}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <CurrencyPoundIcon sx={{ verticalAlign: 'middle' }} /> <strong>Compensation</strong>
            </Typography>
            <Typography variant="body1">
              £{jobDetails.compensation_amount} ({jobDetails.compensation_type})
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <WorkIcon sx={{ verticalAlign: 'middle' }} /> <strong>Job Type</strong>
            </Typography>
            <Typography variant="body1">
              {jobDetails.job_type}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <InfoIcon sx={{ verticalAlign: 'middle' }} /> <strong>Employment Term</strong>
            </Typography>
            <Typography variant="body1">
              {jobDetails.employment_term}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <SkillsIcon sx={{ verticalAlign: 'middle' }} /> <strong>Skills</strong>
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
  );
};

// ApplicationCard component
const ApplicationCard: React.FC<{ application: ApplicationDetails; onClick: () => void }> = ({ application, onClick }) => (
  <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 2 }}>
          {application.full_name}
        </Typography>
        {application.profile_picture && (
          <Avatar
            src={`data:image/jpeg;base64,${application.profile_picture}`}
            alt={application.full_name}
            sx={{ width: 77, height: 77 }}
          />
        )}
      </Box>
      <Typography variant="body1" paragraph>
        <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Email</strong>
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {application.email}
      </Typography>
      <Typography variant="body1" paragraph>
        <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Phone Number</strong>
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {application.phone_number}
      </Typography>
      <Typography variant="body1" paragraph>
        <SkillsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Skills</strong>
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
        {application.skills.map((skill, index) => (
          <Chip key={index} label={skill} color="success" />
        ))}
      </Box>
      <Typography variant="body1" paragraph>
        <AssignmentTurnedInIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Status</strong>
      </Typography>
      <Chip label={application.status} variant="outlined" color="default" />
    </CardContent>
  </Card>
);

// JobPosting component
const JobPosting: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails>(defaultJobDetails);
  const [applications, setApplications] = useState<ApplicationDetails[]>([]);
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { username } = useGlobalState();

  useEffect(() => {
    console.log("jobId: ", jobId);
    console.log("username: ", username);

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
        setApplications(data.applications);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId, username]);

  const handleCardClick = (application: ApplicationDetails) => {
    navigate(`/jobapplication/${application.id}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Posting Details
      </Typography>
      <JobDetailsCard jobDetails={jobDetails} />
      <Typography variant="h4" gutterBottom mt={4}>
        Job Applications
      </Typography>
      <Grid container spacing={2}>
        {applications.map((application, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <ApplicationCard application={application} onClick={() => handleCardClick(application)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default JobPosting;