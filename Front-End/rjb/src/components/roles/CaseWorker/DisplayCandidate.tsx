import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip } from '@mui/material';
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

const DisplayCandidate: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) {
        console.error('Email is undefined');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/advisors/getCandidateProfile?email=${encodeURIComponent(email)}`);
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

    fetchProfile();
  }, [email]);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Candidate Profile
      </Typography>
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
                <Typography variant="body1" ml={1}><a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer">LinkedIn</a></Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <GitHubIcon />
                <Typography variant="body1" ml={1}><a href={profile.github_profile} target="_blank" rel="noopener noreferrer">GitHub</a></Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <InfoIcon />
                <Typography variant="body1" ml={1} mr={1}>Immigration Status:</Typography>
                <Chip label={profile.immigration_status} style={{ backgroundColor: 'purple', color: 'white' }} />
              </Box>
              <Typography variant="h6" mb={1}>Summary</Typography>
              <Typography variant="body1" mb={2}>{profile.summary}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
    </Box>
  );
};

export default DisplayCandidate;