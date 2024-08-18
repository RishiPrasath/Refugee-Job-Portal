import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../globalState/globalState';
import { Box, Typography, TextField, Button, Grid, InputAdornment, Alert } from '@mui/material';

type Props = {}

const ApplyForJob: React.FC<Props> = () => {
  const { company, jobTitle, jobId } = useParams<{ company: string; jobTitle: string; jobId: string }>();
  const { email, username } = useGlobalState();
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('jobId:', jobId);
    console.log('jobTitle:', jobTitle);
    console.log('company:', company);
    console.log('email:', email);
    console.log('username:', username);
    console.log('Cover Letter:', coverLetter);
  }, [coverLetter]);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf' && file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeError('Only PDF or DOC files are allowed.');
        setResume(null);
      } else {
        setResume(file);
        setResumeError(null);
      }
    }
  };

  const handleCoverLetterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCoverLetter(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resume) {
      setFormError('Please upload a valid PDF or DOC file.');
      return;
    }
    if (resumeError) {
      setFormError(resumeError);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('job_title', jobTitle || '');
    formData.append('company_name', company || '');
    formData.append('job_id', jobId || '');
    formData.append('resume', resume);
    if (coverLetter) {
      formData.append('cover_letter', coverLetter);
    }

    try {
      const response = await fetch('http://localhost:8000/candidates/submitJobApplication', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        navigate('/profile');
      } else {
        const data = await response.json();
        setFormError(data.error || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      setFormError('Failed to submit application.');
    }
  };

  const JobDetails: React.FC = () => (
    <Box mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold">Job Title</Typography>
          <Typography variant="body1">{jobTitle}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold">Company Name</Typography>
          <Typography variant="body1">{company}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold">Username</Typography>
          <Typography variant="body1">{username}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold">Email</Typography>
          <Typography variant="body1">{email}</Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const FileUpload: React.FC = () => (
    <Box mb={2}>
      <TextField
        variant="outlined"
        fullWidth
        label="Upload Resume"
        error={!!resumeError}
        helperText={resumeError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" component="label">
                Upload
                <input type="file" hidden onChange={handleResumeChange} />
              </Button>
            </InputAdornment>
          ),
          startAdornment: resume && (
            <InputAdornment position="start">
              <Typography variant="body1" sx={{ mr: 1 }}>
                {resume.name}
              </Typography>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Apply for Job
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <JobDetails />
        <FileUpload />
        <Box mb={2}>
          <TextField
            label="Cover Letter (Optional)"
            name="coverLetter"
            value={coverLetter}
            onChange={handleCoverLetterChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        <Button type="submit" variant="contained" color="primary">
          Submit Application
        </Button>
      </form>
    </Box>
  );
}

export default ApplyForJob;