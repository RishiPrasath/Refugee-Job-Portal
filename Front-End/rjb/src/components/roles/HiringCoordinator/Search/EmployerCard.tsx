import React from 'react';
import { CardContent, Box, Avatar, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';

interface EmployerCardProps {
  result: {
    image: string | null;
    company_name?: string;
    industry?: string;
    location?: string;
    description?: string;
  };
}

const EmployerCard: React.FC<EmployerCardProps> = ({ result }) => (
  <CardContent sx={{ flexGrow: 1 }}>
    <Box display="flex" alignItems="center" mb={2}>
      <Avatar src={result.image || undefined} sx={{ width: 56, height: 56, mr: 2 }} />
      <Typography variant="h6">{result.company_name}</Typography>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={2}>
      <BusinessIcon fontSize="small" />
      <Box ml={1}>
        <Typography variant="body2" fontWeight="bold">Industry:</Typography>
        <Typography variant="body2">{result.industry}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={2}>
      <LocationOnIcon fontSize="small" />
      <Box ml={1}>
        <Typography variant="body2" fontWeight="bold">Location:</Typography>
        <Typography variant="body2">{result.location}</Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="flex-start" mb={2}>
      <DescriptionIcon fontSize="small" />
      <Box ml={1}>
        <Typography variant="body2" fontWeight="bold">Description:</Typography>
        <Typography variant="body2">{result.description}</Typography>
      </Box>
    </Box>
  </CardContent>
);

export default EmployerCard;