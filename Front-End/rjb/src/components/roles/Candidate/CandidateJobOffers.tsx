import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../globalState/globalState';
import { Box, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import JobOfferCard from './CandidateJobOffers/JobOfferCard';

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

const CandidateJobOffers: React.FC = () => {
  const { username, email } = useGlobalState();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  const fetchJobOffers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/candidates/getCandidateJobOffers?username=${username}&email=${email}`);
      const data = await response.json();
      console.log('Job Offers:', data);  // Log the response
      setJobOffers(data);
    } catch (error) {
      console.error('Error fetching job offers:', error);
    }
  };

  useEffect(() => {
    fetchJobOffers();
  }, [username, email]);

  const handleStatusChange = () => {
    fetchJobOffers();
  };

  const pendingOffers = jobOffers.filter(offer => offer.status === 'Pending');
  const approvedOffers = jobOffers.filter(offer => offer.status === 'Approved');
  const rejectedOffers = jobOffers.filter(offer => offer.status === 'Rejected');

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Candidate Job Offers
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
        Manage your job offers by approving or rejecting them.
      </Typography>

      {pendingOffers.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Pending Job Offers
          </Typography>
          <Grid container spacing={3}>
            {pendingOffers.map((jobOffer) => (
              <Grid item xs={12} key={jobOffer.id}>
                <JobOfferCard jobOffer={jobOffer} onStatusChange={handleStatusChange} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {(approvedOffers.length > 0 || rejectedOffers.length > 0) && (
        <Divider sx={{ my: 4 }} />
      )}

      {approvedOffers.length > 0 && (
        <Accordion 
          expanded={expanded === 'approved'} 
          onChange={() => setExpanded(expanded === 'approved' ? false : 'approved')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Approved Job Offers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {approvedOffers.map((jobOffer) => (
                <Grid item xs={12} key={jobOffer.id}>
                  <JobOfferCard jobOffer={jobOffer} onStatusChange={handleStatusChange} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {rejectedOffers.length > 0 && (
        <Accordion 
          expanded={expanded === 'rejected'} 
          onChange={() => setExpanded(expanded === 'rejected' ? false : 'rejected')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Rejected Job Offers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {rejectedOffers.map((jobOffer) => (
                <Grid item xs={12} key={jobOffer.id}>
                  <JobOfferCard jobOffer={jobOffer} onStatusChange={handleStatusChange} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default CandidateJobOffers;