import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Button, CardActions } from '@mui/material';
import { useGlobalState } from '../../../globalState/globalState';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SkillIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';

interface CandidateProfile {
  full_name: string;
  email: string;
  immigration_status: string;
  accessibility_requirements: string | null;
  contact_phone: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  linkedin_profile: string;
  github_profile: string;
  summary: string;
  skills: Skill[];
  qualifications: Qualification[];
  workExperiences: WorkExperience[];
  profile_picture: string | null;
  caseworker: Caseworker | null;
}

interface Skill {
  id: number;
  skill_name: string;
  description: string | null;
}

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  start_year: number;
  end_year: number;
  candidate_id: number;
}

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  start_year: number;
  end_year: number;
  description: string;
  candidate_id: number;
}

interface Caseworker {
  full_name: string;
  email: string;
}

interface Job {
  id: number;
  job_title: string;  // For applied jobs
  company_name: string;  // For applied jobs
  title?: string;  // For saved jobs
  company?: string;  // For saved jobs
  location?: string;  // Optional, as it might not be present in the response
  immigrationSalaryList?: boolean;  // Optional, as it might not be present in the response
  status?: string;  // Optional, as it might not be present in the response
  date_time_applied?: string;  // Optional, as it might not be present in the response
}

const CandidateProfile: React.FC = () => {
  const { username, email } = useGlobalState();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]); // New state for applied jobs
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email || !username) {
        console.error('Email or username is undefined');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/candidates/getCandidateProfile?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          console.error('Error fetching profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getSavedJobs?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        const data = await response.json();
        if (response.ok) {
          setSavedJobs(data);
        } else {
          console.error('Error fetching saved jobs:', data.error);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    const fetchAppliedJobs = async () => { // New function to fetch applied jobs
      try {
        const response = await fetch(`http://localhost:8000/candidates/getAppliedJobs?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        const data = await response.json();
        if (response.ok) {
          console.log("Applied Jobs:", data);
          setAppliedJobs(data);
        } else {
          console.error('Error fetching applied jobs:', data.error);
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      }
    };

    fetchProfile();
    fetchSavedJobs();
    fetchAppliedJobs(); // Fetch applied jobs
  }, [email, username]);

  const handleCardClick = (jobId: number, company: string | undefined) => {
    if (company) {
      navigate(`/candidate-job-view/${company}/${jobId}`);
    } else {
      console.error('Company name is undefined');
    }
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                {profile.profile_picture && (
                  <Avatar
                    src={`data:image/jpeg;base64,${profile.profile_picture}`}
                    alt={profile.full_name}
                    sx={{ width: 128, height: 128 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h4">{profile.full_name}</Typography>
                <Typography variant="body1"><EmailIcon /> {profile.email}</Typography>
                <Typography variant="body1"><PhoneIcon /> {profile.contact_phone}</Typography>
                <Typography variant="body1"><CakeIcon /> {profile.date_of_birth}</Typography>
                <Typography variant="body1"><ContactEmergencyIcon /> {profile.emergency_contact_name} ({profile.emergency_contact_phone})</Typography>
                <Typography variant="body1"><LinkedInIcon /> <a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer">LinkedIn</a></Typography>
                <Typography variant="body1"><GitHubIcon /> <a href={profile.github_profile} target="_blank" rel="noopener noreferrer">GitHub</a></Typography>
                <Typography variant="body1"><InfoIcon /> Immigration Status: {profile.immigration_status}</Typography>
                {profile.accessibility_requirements && (
                  <Typography variant="body1"><InfoIcon /> Accessibility Requirements: {profile.accessibility_requirements}</Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      {profile.caseworker && (
        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <ContactEmergencyIcon style={{ marginRight: '8px' }} /> Caseworker Details
              </Typography>
              <Typography variant="body1"><strong>Full Name:</strong> {profile.caseworker.full_name}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {profile.caseworker.email}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <SkillIcon style={{ marginRight: '8px' }} /> Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile.skills.map(skill => (
                <Chip key={skill.id} label={skill.skill_name} style={{ backgroundColor: 'green', color: 'white' }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <SchoolIcon style={{ marginRight: '8px' }} /> Qualifications
            </Typography>
            {profile.qualifications.map(qualification => (
              <Card key={qualification.id} variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                <CardContent>
                  <Typography variant="body2">
                    <strong>{qualification.school}</strong>, {qualification.qualification} ({qualification.start_year} - {qualification.end_year})
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <WorkIcon style={{ marginRight: '8px' }} /> Work Experiences
            </Typography>
            {profile.workExperiences.map(experience => (
              <Box key={experience.id} mb={2}>
                <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                  <CardContent>
                    <Box display="flex" mb={1}>
                      <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Company:</strong></Typography>
                      <Typography variant="body2">{experience.company}</Typography>
                    </Box>
                    <Box display="flex" mb={1}>
                      <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Role:</strong></Typography>
                      <Typography variant="body2">{experience.role}</Typography>
                    </Box>
                    <Box display="flex" mb={1}>
                      <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Years:</strong></Typography>
                      <Typography variant="body2">{experience.start_year} - {experience.end_year}</Typography>
                    </Box>
                    <Box display="flex" mb={1}>
                      <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Description:</strong></Typography>
                      <Typography variant="body2">{experience.description}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
      {appliedJobs.length > 0 && ( // New section for applied jobs
        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <WorkIcon style={{ marginRight: '8px' }} /> Applied Job Postings
              </Typography>
              <Grid container spacing={2}>
                {appliedJobs.map((job, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => handleCardClick(job.id, job.company_name)}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" style={{ marginBottom: '8px' }}>
                          {job.job_title}
                        </Typography>
                        <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                          {job.company_name}
                        </Typography>
                        <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                          <strong>Status</strong>
                        </Typography>
                        <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                          {job.status}
                        </Typography>
                        <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                          <strong>Applied on</strong>
                        </Typography>
                        <Typography color="text.secondary" style={{ marginBottom: '8px' }}>
                          {job.date_time_applied ? new Date(job.date_time_applied).toLocaleDateString() : 'N/A'} at {job.date_time_applied ? new Date(job.date_time_applied).toLocaleTimeString() : 'N/A'}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ marginTop: 'auto' }}>
                        <Button size="small">Learn More</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
      {savedJobs.length > 0 && (
        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <WorkIcon style={{ marginRight: '8px' }} /> Saved Job Postings
              </Typography>
              <Grid container spacing={2}>
                {savedJobs.map((job, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => handleCardClick(job.id ?? 0, job.company)}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div">
                          {job.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {job.company}
                        </Typography>
                        <Typography color="text.secondary">
                          {job.location}
                        </Typography>
                        {job.immigrationSalaryList && (
                          <Chip label="Immigration Salary List" sx={{ backgroundColor: 'purple', color: 'white', padding: '0.02px' }} />
                        )}
                      </CardContent>
                      <CardActions sx={{ marginTop: 'auto' }}>
                        <Button size="small">Learn More</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default CandidateProfile;