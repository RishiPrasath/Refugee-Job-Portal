import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Card, CardContent, Grid } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface JobOfferComponentProps {
  applicationId: string;
}

const JobOfferComponent: React.FC<JobOfferComponentProps> = ({ applicationId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jobOffer, setJobOffer] = useState({
    job_offer_document: '',
    additional_details: '',
    offer_datetime: '',
    status: '',
    id: '',
  });
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [jobOfferDocument, setJobOfferDocument] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch job offer details on page load
    const fetchJobOfferDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/employers/getJobOffer/${applicationId}/`);
        const data = await response.json();
        if (response.ok) {
          console.log('Fetched job offer details:', data); // Debugging
          setJobOffer(data);
          setAdditionalDetails(data.additional_details);
        } else {
          console.error('Error fetching job offer details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching job offer details:', error);
      }
    };

    fetchJobOfferDetails();
  }, [applicationId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setFileError('Please upload a PDF file.');
        setJobOfferDocument(null);
      } else {
        setFileError(null);
        setJobOfferDocument(file);
      }
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalDetails(e.target.value);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('jobOfferId', jobOffer.id);
    formData.append('additionalDetails', additionalDetails);
    if (jobOfferDocument) {
      formData.append('jobOfferDocument', jobOfferDocument);
    }

    try {
      const response = await fetch('http://localhost:8000/employers/updateJobOffer/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setIsEditing(false);
        // Update the job offer data
        setJobOffer((prevJobOffer) => ({
          ...prevJobOffer,
          additional_details: data.additional_details,
          job_offer_document: data.job_offer_document,
        }));
      } else {
        console.error('Error updating job offer:', data.error);
      }
    } catch (error) {
      console.error('Error updating job offer:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAdditionalDetails(jobOffer.additional_details);
    setJobOfferDocument(null);
    setFileError(null);
  };

  return (
    <Card sx={{ mb: 4, p: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Job Offer</Typography>
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
            <Typography variant="body1"><strong>Additional Details:</strong> {isEditing ? (
              <TextField
                value={additionalDetails}
                onChange={handleDetailsChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            ) : (
              jobOffer.additional_details
            )}</Typography>
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
        {isEditing && (
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              type="file"
              inputProps={{ accept: 'application/pdf' }}
              onChange={handleFileChange}
              fullWidth
            />
            {fileError && <Typography color="error" variant="body2">{fileError}</Typography>}
          </Box>
        )}
        {!isEditing && (
          <Box mt={2} display="flex" flexDirection="column" alignItems="flex-start">
            <Button
              variant="contained"
              color="primary"
              startIcon={<DescriptionIcon />}
              href={jobOffer.job_offer_document}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 2 }}
            >
              Download Job Offer Document
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{ mb: 2 }}
            >
              Edit
            </Button>
          </Box>
        )}
        {isEditing && (
          <Box display="flex" justifyContent="center" mt={2} gap={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JobOfferComponent;