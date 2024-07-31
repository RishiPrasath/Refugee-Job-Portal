import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface JobOffer {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  employment_term: string;
  offer_datetime: string;
  additional_details: string;
  job_offer_document: string;
  status: string;
  company_logo: string;
}

const JobOfferCard: React.FC<{ jobOffer: JobOffer, onStatusChange: () => void }> = ({ jobOffer, onStatusChange }) => {
  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:8000/candidates/approveJobOffer/${jobOffer.id}/`, {
        method: 'POST',
      });
      if (response.ok) {
        onStatusChange();
      } else {
        console.error('Error approving job offer');
      }
    } catch (error) {
      console.error('Error approving job offer:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/candidates/rejectJobOffer/${jobOffer.id}/`, {
        method: 'POST',
      });
      if (response.ok) {
        onStatusChange();
      } else {
        console.error('Error rejecting job offer');
      }
    } catch (error) {
      console.error('Error rejecting job offer:', error);
    }
  };

  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 1, position: 'relative' }}>
      {jobOffer.company_logo && (
        <Avatar
          alt={jobOffer.company_name}
          src={jobOffer.company_logo}
          sx={{ width: 100, height: 100, position: 'absolute', top: -7, right: -7, margin: 2 }}
        />
      )}
      <Typography variant="subtitle1" gutterBottom><strong> {jobOffer.job_title} </strong></Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <WorkIcon sx={{ mr: 1 }} />
        <Typography variant="subtitle1" gutterBottom><strong>Company Name:</strong> {jobOffer.company_name}</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <EventIcon sx={{ mr: 1 }} />
        <Typography variant="body1"><strong>Offer Date:</strong> {new Date(jobOffer.offer_datetime).toLocaleString()}</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOnIcon sx={{ mr: 1 }} />
        <Typography variant="body1"><strong>Location:</strong> {jobOffer.location}</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <WorkIcon sx={{ mr: 1 }} />
        <Typography variant="body1"><strong>Employment Term:</strong> {jobOffer.employment_term}</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <InfoIcon sx={{ mr: 1 }} />
        <Typography variant="body1"><strong>Additional Details:</strong> {jobOffer.additional_details}</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <InfoIcon sx={{ mr: 1 }} />
        <Typography variant="body1"><strong>Status:</strong> {jobOffer.status}</Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DescriptionIcon />}
        href={jobOffer.job_offer_document}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mt: 2 }}
      >
        Download Job Offer Document
      </Button>
      {jobOffer.status !== 'Approved' && jobOffer.status !== 'Rejected' && (
        <Box display="flex" justifyContent="center" mt={2} gap={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleReject}
          >
            Reject
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default JobOfferCard;