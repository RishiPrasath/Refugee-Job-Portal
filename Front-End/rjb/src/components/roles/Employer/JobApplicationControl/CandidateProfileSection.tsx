import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Grid, Avatar, Typography, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SkillIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import InfoItem from './InfoItem';

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
  company_name: string;
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

const CandidateProfileSection: React.FC<{ profile: CandidateProfile }> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange}
      sx={{
        mb: 4,
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
        backgroundColor: '#ffffff', // Changed to white
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: '#ffffff', // Changed to white
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography variant="h5">Candidate Profile</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="flex-start">
            <Avatar
              alt={profile.full_name}
              src={`data:image/jpeg;base64,${profile.profile_picture}`}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" mb={2}>{profile.full_name}</Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <InfoItem icon={<EmailIcon />} label="Email" value={profile.email} />
              <InfoItem icon={<PhoneIcon />} label="Phone" value={profile.contact_phone} />
              <InfoItem icon={<CakeIcon />} label="Date of Birth" value={profile.date_of_birth} />
              <InfoItem icon={<ContactEmergencyIcon />} label="Emergency Contact" value={`${profile.emergency_contact_name} (${profile.emergency_contact_phone})`} />
              <InfoItem icon={<LinkedInIcon />} label="LinkedIn" value={profile.linkedin_profile} link={profile.linkedin_profile} />
              <InfoItem icon={<GitHubIcon />} label="GitHub" value={profile.github_profile} link={profile.github_profile} />
              <InfoItem icon={<InfoIcon />} label="Summary" value={profile.summary} />
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SkillIcon sx={{ mr: 1 }} /> Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {profile.skills.map((skill, index) => (
              <Chip key={index} label={skill} sx={{ backgroundColor: 'green', color: 'white' }} />
            ))}
          </Box>
        </Box>
        <Box mt={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon sx={{ mr: 1 }} /> Qualifications
          </Typography>
          {profile.qualifications.map(qualification => (
            <Box key={qualification.id} p={2} sx={{ backgroundColor: '#ffffff', borderRadius: '8px', mb: 2 }}>
              <Typography variant="body1">
                <strong>{qualification.school}</strong>, {qualification.qualification} ({qualification.start_year} - {qualification.end_year})
              </Typography>
            </Box>
          ))}
        </Box>
        <Box mt={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ mr: 1 }} /> Work Experiences
          </Typography>
          {profile.workExperiences.map(experience => (
            <Box key={experience.id} p={2} sx={{ backgroundColor: '#ffffff', borderRadius: '8px' }}>
              <Typography variant="body2">
                <strong>{experience.company}</strong>, {experience.role} ({experience.start_year} - {experience.end_year})
              </Typography>
              <Typography variant="body2">{experience.description}</Typography>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CandidateProfileSection;