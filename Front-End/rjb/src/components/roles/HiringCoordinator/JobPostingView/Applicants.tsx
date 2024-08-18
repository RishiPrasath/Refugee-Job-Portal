import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SkillsIcon from '@mui/icons-material/Build';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

interface Applicant {
  id: number;
  full_name: string;
  email: string;
  skills: string[];
  phone_number: string;
  profile_picture: string | null;
  status: string;
}

interface ApplicantsProps {
  applicants: Applicant[];
  onCardClick: (applicant: Applicant) => void;
}

const Applicants: React.FC<ApplicantsProps> = ({ applicants, onCardClick }) => {
  return (
    <Grid container spacing={2}>
      {applicants.map((applicant, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card onClick={() => onCardClick(applicant)} sx={{ cursor: 'pointer' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 2 }}>
                  {applicant.full_name}
                </Typography>
                {applicant.profile_picture && (
                  <Avatar
                    src={applicant.profile_picture}
                    alt={applicant.full_name}
                    sx={{ width: 77, height: 77 }}
                  />
                )}
              </Box>
              <Typography variant="body1" paragraph>
                <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Email</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {applicant.email}
              </Typography>
              <Typography variant="body1" paragraph>
                <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Phone Number</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {applicant.phone_number}
              </Typography>
              <Typography variant="body1" paragraph>
                <SkillsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Skills</strong>
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                {applicant.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="success" />
                ))}
              </Box>
              <Typography variant="body1" paragraph>
                <AssignmentTurnedInIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> <strong>Status</strong>
              </Typography>
              <Chip label={applicant.status} variant="outlined" color="default" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Applicants;