import React from 'react';
import { Box, Typography } from '@mui/material';

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string; link?: string }> = ({ icon, label, value, link }) => (
  <Box display="flex" alignItems="center" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
    {icon}
    <Typography variant="body2" sx={{ ml: 1, mr: 1, fontWeight: 'bold', whiteSpace: 'nowrap' }}>{label}:</Typography>
    {link ? (
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{value}</Typography>
      </a>
    ) : (
      <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{value}</Typography>
    )}
  </Box>
);

export default InfoItem;