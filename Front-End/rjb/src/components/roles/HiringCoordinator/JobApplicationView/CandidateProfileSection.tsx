import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SkillIcon from '@mui/icons-material/Build';

interface CandidateProfileProps {
  profile: {
    full_name: string;
    email: string;
    phone_number: string;
    profile_picture: string | null;
    linkedin_profile: string;
    github_profile: string;
    skills: string[];
  };
}

const CandidateProfileSection: React.FC<CandidateProfileProps> = ({ profile }) => {
  return (
    <Card sx={{ mb: 4, p: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={profile.profile_picture || 'https://via.placeholder.com/150'}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Typography variant="h5">{profile.full_name}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <EmailIcon sx={{ mr: 1 }} />
          <Typography variant="body1">{profile.email}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <PhoneIcon sx={{ mr: 1 }} />
          <Typography variant="body1">{profile.phone_number}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <LinkedInIcon sx={{ mr: 1 }} />
          <Typography variant="body1">
            <a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <GitHubIcon sx={{ mr: 1 }} />
          <Typography variant="body1">
            <a href={profile.github_profile} target="_blank" rel="noopener noreferrer">
              GitHub Profile
            </a>
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SkillIcon sx={{ mr: 1 }} /> Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {profile.skills.map((skill, index) => (
              <Chip key={index} label={skill} sx={{ backgroundColor: 'green', color: 'white' }} />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CandidateProfileSection;