import React, { useState } from 'react';
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails, Modal, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ActionButtons from './ActionButtons';

interface Application {
  id: number;
  cover_letter: string | null;
  cv_url: string | null;
  status: string;
  created_at: string;
}

interface ApplicationCardProps {
  application: Application;
  onReject: () => void; // New prop for handling rejection
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onReject }) => {
  const [expanded, setExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleDownloadCV = () => {
    if (application.cv_url) {
      window.open(application.cv_url, '_blank');
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Accordion 
        expanded={expanded} 
        onChange={handleChange}
        sx={{
          mb: 4,
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          backgroundColor: '#ffffff', // Changed to white
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: '#ffffff', // Changed to white
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Typography variant="h5">Application Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center">
              <AssignmentIcon sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Cover Letter:</strong> {application.cover_letter || 'Not provided'}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Status:</strong> {application.status}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Applied At:</strong> {application.created_at}</Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="primary" startIcon={<DescriptionIcon />} sx={{ mr: 2 ,mb: 2 }} onClick={handleOpenModal}>
              View Cover Letter
            </Button>
            <Button variant="contained" color="secondary" startIcon={<SaveIcon />} sx={{ mb: 2 }} onClick={handleDownloadCV}>
              Download CV
            </Button>
          </Box>
          {application.status !== 'Approved' && application.status !== 'Rejected' ? (
            <Box mt={3}>
              <ActionButtons applicationId={application.id.toString()} onReject={onReject} />
            </Box>
          ) : (
            <Box mt={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              {application.status === 'Approved' ? (
                <>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color="success.main">Application Approved</Typography>
                </>
              ) : (
                <>
                  <CloseIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color="error.main">Application Rejected</Typography>
                </>
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

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
            {application.cover_letter || 'No cover letter provided.'}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ApplicationCard;