import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useGlobalState } from '../../../globalState/globalState';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

type Candidate = {
  full_name: string;
  email: string;
  immigration_status: string;
  accessibility_requirements: string;
};

const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/candidate/${candidate.email}`);
  };

  return (
    <Grid item xs={12} sm={6} md={4} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Card elevation={3} style={{ borderRadius: '8px' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PersonIcon style={{ marginRight: '0.75rem' }} />
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>{candidate.full_name}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <EmailIcon style={{ marginRight: '0.75rem' }} />
            <Typography variant="body2">Email: {candidate.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <InfoIcon style={{ marginRight: '0.75rem' }} />
            <Typography variant="body2">Immigration Status: {candidate.immigration_status}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <AccessibilityIcon style={{ marginRight: '0.75rem' }} />
            <Typography variant="body2">Accessibility Requirements: {candidate.accessibility_requirements}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

const ViewCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { username, email } = useGlobalState();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const url = `http://localhost:8000/advisors/getAssignedCandidates?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setCandidates(data.candidates);
        } else {
          console.error('Error fetching candidates:', data.error);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, [username, email]);

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Assigned Candidates
      </Typography>

      <Grid container spacing={3}>
        {candidates.map((candidate, index) => (
          <CandidateCard key={index} candidate={candidate} />
        ))}
      </Grid>
    </div>
  );
};

export default ViewCandidates;