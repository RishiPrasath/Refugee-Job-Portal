import React from 'react';
import { CardContent, Box, Avatar, Typography, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';

interface JobPostingCardProps {
  result: {
    image: string | null;
    job_title?: string;
    company?: string;
    location?: string;
    compensation_amount?: number;
    compensation_type?: string;
    job_type?: string;
    employment_term?: string;
    ISL?: boolean;
    skills?: string[];
  };
}

const JobPostingCard: React.FC<JobPostingCardProps> = ({ result }) => (
  <CardContent sx={{ flexGrow: 1 }}>
    <Box display="flex" alignItems="center" mb={2}>
      <Avatar src={result.image || undefined} sx={{ width: 56, height: 56, mr: 2 }} />
      <Typography variant="h6">{result.job_title}</Typography>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Company:</Typography>
        <Typography variant="body2">{result.company}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Location:</Typography>
        <Typography variant="body2">{result.location}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Compensation:</Typography>
        <Typography variant="body2">{result.compensation_amount} {result.compensation_type}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Job Type:</Typography>
        <Typography variant="body2">{result.job_type}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" fontWeight="bold">Employment Term:</Typography>
        <Typography variant="body2">{result.employment_term}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={1}>
      {result.ISL && (
        <Chip 
          label="Immigration Salary List" 
          size="small" 
          sx={{ 
            backgroundColor: 'purple', 
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkblue',
            }
          }} 
        />
      )}
    </Box>
    {result.skills && result.skills.length > 0 && (
      <Box>
        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          Skills:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {result.skills.map((skill, index) => (
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
    )}
  </CardContent>
);

export default JobPostingCard;