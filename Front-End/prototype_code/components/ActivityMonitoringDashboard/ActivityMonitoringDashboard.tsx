import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Define interfaces for the activity data
interface CandidateActivity {
  candidate_id: number;
  full_name: string;
  lastActive: string;
  status: string;
  lastApplied: string;
}

interface JobApplication {
  job_id: number;
  status: string;
  lastUpdated: string;
}

interface EmployerActivity {
  employer_id: number;
  employer_name: string;
  lastPost: string;
  status: string;
  jobApplications: JobApplication[];
}

interface Data {
  candidateActivity: CandidateActivity[];
  employerActivity: EmployerActivity[];
}

// Sample data
const data: Data = {
  candidateActivity: [
    {
      candidate_id: 1,
      full_name: "Jane Smith",
      lastActive: "2024-05-30",
      status: "active",
      lastApplied: "2024-05-20"
    },
    {
      candidate_id: 2,
      full_name: "Michael Johnson",
      lastActive: "2024-05-20",
      status: "inactive",
      lastApplied: "2024-05-10"
    },
    {
      candidate_id: 3,
      full_name: "Emily Davis",
      lastActive: "2024-06-01",
      status: "active",
      lastApplied: "2024-05-22"
    },
    {
      candidate_id: 4,
      full_name: "John Doe",
      lastActive: "2024-05-25",
      status: "inactive",
      lastApplied: "2024-05-05"
    }
  ],
  employerActivity: [
    {
      employer_id: 2,
      employer_name: "Tech Corp",
      lastPost: "2024-05-25",
      status: "active",
      jobApplications: [
        {
          job_id: 1,
          status: "under review",
          lastUpdated: "2024-05-30"
        },
        {
          job_id: 2,
          status: "pending interview",
          lastUpdated: "2024-05-28"
        }
      ]
    },
    {
      employer_id: 3,
      employer_name: "Data Solutions",
      lastPost: "2024-05-15",
      status: "inactive",
      jobApplications: [
        {
          job_id: 3,
          status: "under review",
          lastUpdated: "2024-05-20"
        }
      ]
    },
    {
      employer_id: 4,
      employer_name: "Innovatech",
      lastPost: "2024-06-01",
      status: "active",
      jobApplications: [
        {
          job_id: 4,
          status: "under review",
          lastUpdated: "2024-06-01"
        },
        {
          job_id: 5,
          status: "pending interview",
          lastUpdated: "2024-06-03"
        }
      ]
    }
  ]
};

const ActivityMonitoringDashboard: React.FC = () => {
  const { candidateActivity, employerActivity } = data;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderCandidateTable = () => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        Inactive Candidates
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Applied</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidateActivity.filter((candidate) => candidate.status === 'inactive' || new Date(candidate.lastApplied) < new Date(new Date().setDate(new Date().getDate() - 14)))
              .map((candidate) => (
                <TableRow key={candidate.candidate_id}>
                  <TableCell>{candidate.full_name}</TableCell>
                  <TableCell>{candidate.lastActive}</TableCell>
                  <TableCell>{candidate.status}</TableCell>
                  <TableCell>{candidate.lastApplied}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderCandidateCards = () => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        Inactive Candidates
      </Typography>
      <Grid container spacing={2}>
        {candidateActivity.filter((candidate) => candidate.status === 'inactive' || new Date(candidate.lastApplied) < new Date(new Date().setDate(new Date().getDate() - 14)))
          .map((candidate) => (
            <Grid item xs={12} key={candidate.candidate_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{candidate.full_name}</Typography>
                  <Typography variant="body2">Last Active: {candidate.lastActive}</Typography>
                  <Typography variant="body2">Status: {candidate.status}</Typography>
                  <Typography variant="body2">Last Applied: {candidate.lastApplied}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );

  const renderEmployerTable = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Employer Activity
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employer Name</TableCell>
              <TableCell>Last Post</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Job ID</TableCell>
              <TableCell>Application Status</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employerActivity.flatMap((employer) =>
              employer.jobApplications.map((application) => (
                <TableRow key={`${employer.employer_id}-${application.job_id}`}>
                  <TableCell>{employer.employer_name}</TableCell>
                  <TableCell>{employer.lastPost}</TableCell>
                  <TableCell>{employer.status}</TableCell>
                  <TableCell>{application.job_id}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>{application.lastUpdated}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderEmployerCards = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Employer Activity
      </Typography>
      <Grid container spacing={2}>
        {employerActivity.flatMap((employer) =>
          employer.jobApplications.map((application) => (
            <Grid item xs={12} key={`${employer.employer_id}-${application.job_id}`}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{employer.employer_name}</Typography>
                  <Typography variant="body2">Last Post: {employer.lastPost}</Typography>
                  <Typography variant="body2">Status: {employer.status}</Typography>
                  <Typography variant="body2">Job ID: {application.job_id}</Typography>
                  <Typography variant="body2">Application Status: {application.status}</Typography>
                  <Typography variant="body2">Last Updated: {application.lastUpdated}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Activity Monitoring Dashboard
      </Typography>
      {isMobile ? renderCandidateCards() : renderCandidateTable()}
      {isMobile ? renderEmployerCards() : renderEmployerTable()}
    </Box>
  );
};

export default ActivityMonitoringDashboard;
