import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';

interface JobPosting {
  id: number;
  job_title: string;
  job_description: string;
  location: string;
  compensation_amount: number;
  compensation_type: string;
  job_type: string;
  employment_term: string;
  status: string;
  ISL: boolean;
  skills: string[];
}

interface JobPostingsProps {
  jobPostings: JobPosting[];
  companyName: string;
  logoUrl: string;
}

const JobPostings: React.FC<JobPostingsProps> = ({ jobPostings, companyName, logoUrl }) => {
  const navigate = useNavigate();

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>Job Postings</Typography>
      <Grid container spacing={2}>
        {jobPostings.map((job, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              variant="elevation" 
              elevation={3} 
              style={{ marginBottom: '10px', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => navigate(`/jobposting-view/${job.id}`)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar src={logoUrl} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Typography variant="h6">{job.job_title}</Typography>
                </Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Company:</Typography>
                    <Typography variant="body2">{companyName}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Location:</Typography>
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Compensation:</Typography>
                    <Typography variant="body2">{job.compensation_amount} {job.compensation_type}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Job Type:</Typography>
                    <Typography variant="body2">{job.job_type}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Employment Term:</Typography>
                    <Typography variant="body2">{job.employment_term}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  {job.ISL && (
                    <Chip 
                      label="Immigration Salary List" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'purple', 
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'darkblue',
                        }
                      }} 
                    />
                  )}
                </Box>
                {job.skills && job.skills.length > 0 && (
                  <Box>
                    <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      Skills:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {job.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small"
                          sx={{ 
                            backgroundColor: 'green', 
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'darkgreen',
                            }
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobPostings;