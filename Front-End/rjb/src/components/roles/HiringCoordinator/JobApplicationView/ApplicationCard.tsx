import React, { useState } from 'react';
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ApplicationCardProps {
  application: {
    id: number;
    job_title: string;
    employer: string;
    application_status: string;
    cover_letter: string;
    cv_url: string;
    created_at: string;
  };
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange} sx={{ mb: 4, backgroundColor: '#ffffff', borderRadius: '8px' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="application-content"
        id="application-header"
      >
        <Typography variant="h5">Application Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center">
            <WorkIcon sx={{ mr: 1 }} />
            <Typography variant="body1"><strong>Job Title:</strong> {application.job_title}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <BusinessIcon sx={{ mr: 1 }} />
            <Typography variant="body1"><strong>Employer:</strong> {application.employer}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <AssignmentTurnedInIcon sx={{ mr: 1 }} />
            <Typography variant="body1"><strong>Status:</strong> {application.application_status}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <EventIcon sx={{ mr: 1 }} />
            <Typography variant="body1"><strong>Created At:</strong> {application.created_at}</Typography>
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<MailIcon />}
              onClick={() => alert(application.cover_letter)}
              sx={{ mr: 2 }}
            >
              View Cover Letter
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href={application.cv_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View CV
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ApplicationCard;