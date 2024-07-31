import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../globalState/globalState';
import { Box, Typography, Avatar, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Badge } from '@mui/material';
import { Work, Event, CheckCircle, Close, ExpandMore, AccessTimeFilled, Cancel } from '@mui/icons-material';

interface Application {
  job_title: string;
  company: string;
  logo: string | null;
  status: string;
  employment_term: string;
  created_at: string;
}

const ApplicationStatus: React.FC = () => {
  const { username, email, userType } = useGlobalState();
  const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);
  const [rejectedApplications, setRejectedApplications] = useState<Application[]>([]);
  const [underReviewApplications, setUnderReviewApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getCandidateApplications?username=${username}&email=${email}`);
        const data = await response.json();
        if (response.ok) {
          setApprovedApplications(data.approved_applications);
          setRejectedApplications(data.rejected_applications);
          setUnderReviewApplications(data.under_review_applications);
        } else {
          console.error('Error fetching applications:', data.error);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [username, email]);

  const renderApplicationCard = (application: Application) => (
    <Card key={application.job_title} sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {application.logo && (
            <Avatar
              alt={application.company}
              src={`data:image/png;base64,${application.logo}`}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
          )}
          <Box>
            <Typography variant="h6">{application.job_title}</Typography>
            <Typography variant="body2" color="textSecondary">{application.company}</Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center">
            <Work sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Employment Term:</strong> {application.employment_term}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Event sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Applied On:</strong> {application.created_at}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {application.status === 'Approved' ? (
              <CheckCircle color="success" sx={{ mr: 1 }} />
            ) : application.status === 'Rejected' ? (
              <Cancel color="error" sx={{ mr: 1 }} />
            ) : (
              <AccessTimeFilled sx={{ mr: 1, color: 'orange' }} />
            )}
            <Typography variant="body2"><strong>Status:</strong> {application.status}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Application Status</Typography>
      {approvedApplications.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h5">Approved Applications</Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
              <Badge
                badgeContent={approvedApplications.length}
                color="success"
                sx={{ '& .MuiBadge-badge': { backgroundColor: 'green', color: 'white' }, mr: 2 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {approvedApplications.map(renderApplicationCard)}
          </AccordionDetails>
        </Accordion>
      )}
      {rejectedApplications.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <Cancel color="error" sx={{ mr: 1 }} />
              <Typography variant="h5">Rejected Applications</Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
              <Badge
                badgeContent={rejectedApplications.length}
                color="error"
                sx={{ '& .MuiBadge-badge': { backgroundColor: 'red', color: 'white' }, mr: 2 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {rejectedApplications.map(renderApplicationCard)}
          </AccordionDetails>
        </Accordion>
      )}
      {underReviewApplications.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <AccessTimeFilled sx={{ mr: 1, color: 'orange' }} />
              <Typography variant="h5">Under Review Applications</Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
              <Badge
                badgeContent={underReviewApplications.length}
                sx={{ '& .MuiBadge-badge': { backgroundColor: 'orange', color: 'white' }, mr: 2 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {underReviewApplications.map(renderApplicationCard)}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default ApplicationStatus;