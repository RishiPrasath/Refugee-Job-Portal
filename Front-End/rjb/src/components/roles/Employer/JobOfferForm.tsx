import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

const JobOfferForm: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [jobOfferDocument, setJobOfferDocument] = useState<File | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobOfferDocument) {
      setFileError('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('applicationId', applicationId || '');
    formData.append('additionalDetails', additionalDetails);
    formData.append('jobOfferDocument', jobOfferDocument);

    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch('http://localhost:8000/employers/createJobOffer/', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure cookies are sent with the request
        headers: {
          'X-CSRFToken': csrfToken || '', // Ensure the token is a string
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        navigate(`/jobapplication/${applicationId}`);
      } else {
        console.error('Error submitting job offer:', data.error);
      }
    } catch (error) {
      console.error('Error submitting job offer:', error);
    }
  };

  // Function to get CSRF token from cookies
  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom>
        Create Job Offer
      </Typography>
      <TextField
        type="file"
        label="Upload Job Offer Document"
        InputLabelProps={{ shrink: true }}
        onChange={handleFileChange}
        fullWidth
        sx={{ mb: 2 }}
        helperText={fileError || "Please upload the job offer document in PDF format."}
        error={!!fileError}
        required
      />
      <TextField
        label="Additional Details"
        value={additionalDetails}
        onChange={handleDetailsChange}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
        helperText="Provide any additional details or instructions for the candidate."
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Job Offer
      </Button>
    </Box>
  );
};

export default JobOfferForm;