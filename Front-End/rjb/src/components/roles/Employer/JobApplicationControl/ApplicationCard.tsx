import React, { useState } from 'react';
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails, Modal, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

interface Application {
  id: number;
  cover_letter: string | null;
  cv_url: string | null;
  status: string;
  created_at: string;
}

const ApplicationCard: React.FC<{ application: Application }> = ({ application }) => {
  const [expanded, setExpanded] = useState(true);
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
          backgroundColor: '#f5f5f5',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: '#e0e0e0',
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
              <Typography variant="body2"><strong>Created At:</strong> {application.created_at}</Typography>
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