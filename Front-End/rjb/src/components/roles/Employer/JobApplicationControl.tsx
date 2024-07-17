import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Grid, Avatar, Chip, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
  skills: string[];
  qualifications: Qualification[];
  workExperiences: WorkExperience[];
  profile_picture: string | null;
  status: string;
  application: Application;
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

interface Application {
  id: number;
  cover_letter: string | null;
  cv_url: string | null;
  status: string;
  created_at: string;
}

const CandidateProfileSection: React.FC<{ profile: CandidateProfile }> = ({ profile }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h5">Candidate Profile</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
              <Avatar
                alt={profile.full_name}
                src={`data:image/jpeg;base64,${profile.profile_picture}`}
                sx={{ width: 150, height: 150, marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" mb={2}>{profile.full_name}</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon />
                <Typography variant="body1" ml={1}>{profile.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon />
                <Typography variant="body1" ml={1}>{profile.contact_phone}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <CakeIcon />
                <Typography variant="body1" ml={1}>{profile.date_of_birth}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <ContactEmergencyIcon />
                <Typography variant="body1" ml={1}>{profile.emergency_contact_name} ({profile.emergency_contact_phone})</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <LinkedInIcon />
                <Typography variant="body1" ml={1}>{profile.linkedin_profile}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <GitHubIcon />
                <Typography variant="body1" ml={1}>{profile.github_profile}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <InfoIcon />
                <Typography variant="body1" ml={1}>{profile.summary}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <SkillIcon style={{ marginRight: '8px' }} /> Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profile.skills.map((skill, index) => (
                    <Chip key={index} label={skill} style={{ backgroundColor: 'green', color: 'white' }} />
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
        </CardContent>
      </Card>
    </AccordionDetails>
  </Accordion>
);

const ApplicationCard: React.FC<{ application: Application }> = ({ application }) => {
  const openInNewTab = () => {
    if (application.cv_url) {
      window.open(application.cv_url, '_blank');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          Application Details
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2"><strong>Application ID:</strong> {application.id}</Typography>
          <Typography variant="body2"><strong>Cover Letter:</strong> {application.cover_letter}</Typography>
          {application.cv_url && (
            <Typography variant="body2">
              <strong>CV:</strong> <Button variant="contained" color="primary" onClick={openInNewTab}>Download CV</Button>
            </Typography>
          )}
          <Typography variant="body2"><strong>Status:</strong> {application.status}</Typography>
          <Typography variant="body2"><strong>Created At:</strong> {new Date(application.created_at).toLocaleString()}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ActionButtons: React.FC = () => (
  <Card>
    <CardContent>
      <Box mt={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              fullWidth
              sx={{ borderRadius: '20px', width: { xs: '95%', sm: '90%', md: '80%' }, fontSize: { xs: '0.75rem', sm: '1rem', md: '1.25rem' } ,marginBottom:'10px' }}
            >
              Approve
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="error"
              startIcon={<CloseIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' } }} />}
              sx={{ borderRadius: '20px', width: { xs: '95%', sm: '90%', md: '80%' }, fontSize: { xs: '0.75rem', sm: '1rem', md: '1.25rem' } ,marginBottom:'10px' }}
            >
              Reject
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CalendarTodayIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' } }} />}
              sx={{ borderRadius: '20px', width: { xs: '95%', sm: '90%', md: '80%' }, fontSize: { xs: '0.75rem', sm: '1rem', md: '1.25rem' } ,marginBottom:'10px' }}
            >
              Interview
            </Button>
          </Grid>
        </Grid>
      </Box>
    </CardContent>
  </Card>
);

const JobApplicationControl: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!applicationId) {
        return;
      }

      console.log(`Fetching profile for applicationId: ${applicationId}`);

      try {
        const response = await fetch(`http://localhost:8000/employers/getCandidateApplicationDetails/${applicationId}/`);
        const data = await response.json();
        if (response.ok) {
          console.log("Profile data received: ", data);
          setProfile(data);
        } else {
          console.error('Error fetching profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [applicationId]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Application Details
      </Typography>
      {profile ? (
        <Box padding={3}>
          <CandidateProfileSection profile={profile} />
          <Box mt={3}>
            <ApplicationCard application={profile.application} />
          </Box>
          <Box mt={3}>
            <ActionButtons />
          </Box>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default JobApplicationControl;