import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Modal, IconButton, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

interface Application {
  id: number;
  job_title: string;
  employer: string;
  employer_logo_url: string;
  application_status: string;
  cover_letter: string;
  cv_url: string;
  created_at: string;
}

interface ApplicationsProps {
  applications: Application[];
}

const Applications: React.FC<ApplicationsProps> = ({ applications }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string | null>(null);

  const handleOpenModal = (coverLetter: string) => {
    setSelectedCoverLetter(coverLetter);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCoverLetter(null);
  };

  const handleDownloadCV = (cv_url: string) => {
    window.open(cv_url, '_blank');
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
          <DescriptionIcon style={{ marginRight: '8px' }} /> Applications
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box mt={3}>
          {applications.map((application) => (
            <Card key={application.id} variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar src={application.employer_logo_url} alt={application.employer} sx={{ width: 50, height: 50, marginRight: 2 }} />
                  <Box>
                    <Typography variant="h6">{application.job_title}</Typography>
                    <Typography variant="subtitle1">{application.employer}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  <Typography variant="body1"><strong>Employer:</strong> {application.employer}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                  <Typography variant="body1"><strong>Status:</strong> {application.application_status}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="body1"><strong>Applied on:</strong> {new Date(application.created_at).toLocaleDateString()}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MailIcon />}
                  onClick={() => handleOpenModal(application.cover_letter)}
                  sx={{ mr: 2, mt: 2 }}
                >
                  View Cover Letter
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  onClick={() => handleDownloadCV(application.cv_url)}
                  sx={{ mt: 2 }}
                >
                  Download CV
                </Button>
              </CardContent>
            </Card>
          ))}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="cover-letter-modal-title"
            aria-describedby="cover-letter-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography id="cover-letter-modal-title" variant="h6" component="h2">
                  Cover Letter
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography id="cover-letter-modal-description" sx={{ mt: 2 }}>
                {selectedCoverLetter || 'No cover letter provided.'}
              </Typography>
            </Box>
          </Modal>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Applications;