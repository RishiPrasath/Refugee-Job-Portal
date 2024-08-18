import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface JobOfferComponentProps {
  jobOffer: {
    job_offer_document: string;
    additional_details: string;
    offer_datetime: string;
    status: string;
  };
}

const JobOfferComponent: React.FC<JobOfferComponentProps> = ({ jobOffer }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange} sx={{ mb: 4, backgroundColor: '#ffffff', borderRadius: '8px' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="job-offer-content"
        id="job-offer-header"
      >
        <Typography variant="h5">Job Offer</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <EventIcon />
            </Grid>
            <Grid item>
              <Typography variant="body1"><strong>Offer Date:</strong> {jobOffer.offer_datetime}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" mt={2}>
            <Grid item>
              <InfoIcon />
            </Grid>
            <Grid item xs>
              <Typography variant="body1"><strong>Additional Details:</strong> {jobOffer.additional_details}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" mt={2}>
            <Grid item>
              <InfoIcon />
            </Grid>
            <Grid item>
              <Typography variant="body1"><strong>Status:</strong> {jobOffer.status}</Typography>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DescriptionIcon />}
              href={jobOffer.job_offer_document}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Job Offer Document
            </Button>
          </Box>
        </CardContent>
      </AccordionDetails>
    </Accordion>
  );
};

export default JobOfferComponent;