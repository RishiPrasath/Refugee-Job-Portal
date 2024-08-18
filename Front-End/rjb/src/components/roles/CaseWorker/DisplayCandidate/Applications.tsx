import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Modal, IconButton, Avatar } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import ImageIcon from '@mui/icons-material/Image';
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

  const handleOpenModal = (coverLetter: string | null) => {
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
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <WorkIcon style={{ marginRight: '8px' }} /> Applications
          </Typography>
          {applications.map(application => (
            <Box key={application.id} mb={2}>
              <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <WorkIcon sx={{ mr: 1 }} />
                      <Typography variant="body1"><strong>Job Title:</strong></Typography>
                    </Box>
                    {application.employer_logo_url && (
                      <Avatar src={application.employer_logo_url} alt={application.employer} sx={{ width: 100, height: 100 }} />
                    )}
                  </Box>
                  <Typography variant="body2" mb={2}>{application.job_title}</Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Employer:</strong></Typography>
                  </Box>
                  <Typography variant="body2" mb={2}>{application.employer}</Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <MailIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Cover Letter:</strong></Typography>
                  </Box>
                  <Typography variant="body2" mb={2}>{application.cover_letter}</Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Status:</strong></Typography>
                  </Box>
                  <Typography variant="body2" mb={2}>{application.application_status}</Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Created At:</strong></Typography>
                  </Box>
                  <Typography variant="body2" mb={2}>{application.created_at}</Typography>

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
            </Box>
          ))}
        </CardContent>
      </Card>

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
  );
};

export default Applications;