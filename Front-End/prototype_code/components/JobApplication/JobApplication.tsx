import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Grid, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Define interface for the application form fields
interface FormField {
  label: string;
  type: string;
  name: string;
}

interface ApplicationForm {
  job_id: number;
  fields: FormField[];
}

interface Data {
  applicationForm: ApplicationForm;
}

// Sample data
const data: Data = {
  applicationForm: {
    job_id: 1,
    fields: [
      { label: 'Name', type: 'text', name: 'name' },
      { label: 'Email', type: 'email', name: 'email' },
      { label: 'Cover Letter', type: 'textarea', name: 'cover_letter' },
      { label: 'Upload CV', type: 'file', name: 'cv' }
    ]
  }
};

const JobApplication: React.FC = () => {
  const { fields } = data.applicationForm;

  const [formValues, setFormValues] = useState<{ [key: string]: string | File }>({
    name: '',
    email: '',
    cover_letter: '',
    cv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormValues({
        ...formValues,
        [name]: files[0]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formValues);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Application
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {fields.map((field) => (
                <Grid item xs={12} key={field.name}>
                  {field.type === 'textarea' ? (
                    <Box display="flex" alignItems="center">
                      <DescriptionIcon sx={{ mr: 2 }} />
                      <TextField
                        label={field.label}
                        name={field.name}
                        fullWidth
                        multiline
                        rows={4}
                        value={formValues[field.name] as string}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Box>
                  ) : field.type === 'file' ? (
                    <Box display="flex" alignItems="center">
                      <IconButton color="primary" component="label" sx={{ mr: 2 }}>
                        <UploadFileIcon />
                        <input
                          type="file"
                          name={field.name}
                          hidden
                          onChange={handleFileChange}
                        />
                      </IconButton>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        {field.label}
                      </Typography>
                      <Typography variant="body1">
                        {formValues[field.name] instanceof File ? (formValues[field.name] as File).name : 'No file selected'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      {field.name === 'name' && <PersonIcon sx={{ mr: 2 }} />}
                      {field.name === 'email' && <EmailIcon sx={{ mr: 2 }} />}
                      <TextField
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        fullWidth
                        value={formValues[field.name] as string}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
            <Box mt={3} display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary">
                Submit Application
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobApplication;
