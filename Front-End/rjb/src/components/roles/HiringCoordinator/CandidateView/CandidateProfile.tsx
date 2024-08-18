import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';

interface CandidateProfileProps {
    profile: {
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
        profile_picture: string | null;
    };
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ profile }) => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
                        <Avatar
                            alt={profile.full_name}
                            src={profile.profile_picture || undefined}
                            sx={{ width: 195, height: 195, marginBottom: 2 }}
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
    );
};

export default CandidateProfile;