import React from 'react';
import { CardContent, Box, Avatar, Typography, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

interface CandidateCardProps {
  result: {
    image: string | null;
    full_name?: string;
    email?: string;
    immigration_status?: string;
    accessibility_requirements?: string;
    skills?: string[];
  };
}

const CandidateCard: React.FC<CandidateCardProps> = ({ result }) => (
  <CardContent sx={{ flexGrow: 1 }}>
    <Box display="flex" alignItems="center" mb={2}>
      <Avatar src={result.image || undefined} sx={{ width: 56, height: 56, mr: 2 }} />
      <Typography variant="h6">{result.full_name}</Typography>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Email:</Typography>
        <Typography variant="body2">{result.email}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <InfoIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Immigration Status:</Typography>
        <Typography variant="body2">{result.immigration_status}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={2}>
      <AccessibilityNewIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Accessibility Requirements:</Typography>
        <Typography variant="body2">{result.accessibility_requirements || 'None'}</Typography>
      </Box>
    </Box>
    <Box>
      <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        Skills:
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {result.skills && result.skills.map((skill, index) => (
          <Chip 
            key={index} 
            label={skill} 
            size="small"
            sx={{ 
              backgroundColor: 'green', 
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              }
            }} 
          />
        ))}
      </Box>
    </Box>
  </CardContent>
);

export default CandidateCard;