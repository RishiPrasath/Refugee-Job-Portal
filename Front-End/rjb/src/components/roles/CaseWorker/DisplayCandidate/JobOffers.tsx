import React from 'react';
import { Box, Typography, Card, CardContent, Button, Avatar } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';

interface JobOffer {
  job_title: string;
  employer: string;
  offer_date: string;
  status: string;
  additional_details: string;
  job_offer_document: string;
}

interface JobOffersProps {
  jobOffers: JobOffer[];
}

const JobOffers: React.FC<JobOffersProps> = ({ jobOffers }) => {
  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <WorkIcon style={{ marginRight: '8px' }} /> Job Offers
          </Typography>
          {jobOffers.map((offer, index) => (
            <Box key={index} mb={2}>
              <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom><strong>{offer.job_title}</strong></Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WorkIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" gutterBottom><strong>Employer:</strong> {offer.employer}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Offer Date:</strong> {new Date(offer.offer_date).toLocaleString()}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <InfoIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Status:</strong> {offer.status}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <InfoIcon sx={{ mr: 1 }} />
                    <Typography variant="body1"><strong>Additional Details:</strong> {offer.additional_details}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DescriptionIcon />}
                    href={offer.job_offer_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2 }}
                  >
                    Download Job Offer Document
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobOffers;