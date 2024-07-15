import React, { useState } from 'react';
import { Box, TextField, Typography, InputAdornment, IconButton, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useGlobalState } from '../../../globalState/globalState'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  immigrationSalaryList: boolean;
};

type Props = {}

const SearchJobPostings = (props: Props) => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const { immigration_status } = useGlobalState();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Search query:', query);
    try {
      const response = await fetch(`http://localhost:8000/candidates/searchJobPostings?q=${query}&immigration_status=${immigration_status}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setJobs(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleCardClick = (jobId: number, company: string) => {
    navigate(`/candidate-job-view/${company}/${jobId}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={2}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Search Jobs
      </Typography>
      <Box
        component="form"
        sx={{ mt: 2, width: '100%', maxWidth: 600 }}
        noValidate
        autoComplete="off"
        display="flex"
        alignItems="center"
        onSubmit={handleSearch}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for jobs..."
          sx={{ mb: 2, flexGrow: 1 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  sx={{
                    backgroundColor: 'blue',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'darkblue',
                    },
                    borderRadius: '50%',
                    padding: '10px'
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {jobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => handleCardClick(job.id, job.company)}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {job.title}
                </Typography>
                <Typography color="text.secondary">
                  {job.company}
                </Typography>
                <Typography color="text.secondary">
                  {job.location}
                </Typography>
                {job.immigrationSalaryList && (
                  <Chip label="Immigration Salary List" sx={{ backgroundColor: 'purple', color: 'white', padding: '0.02px' }} />
                )}
              </CardContent>
              <CardActions sx={{ marginTop: 'auto' }}>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SearchJobPostings;