import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Interview {
  id: number;
  interview_type: string;
  date: string;
  start_time: string;
  end_time: string;
  interview_location: string;
  meeting_link: string;
  additional_details: string;
  status: string;
  feedback: string | null;
}

interface InterviewCardProps {
  interviews: Interview[];
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interviews }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange} sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="interviews-content"
        id="interviews-header"
      >
        <Typography variant="h6">Interviews</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {interviews.map((interview) => (
            <ListItem key={interview.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="subtitle1">{interview.interview_type.toUpperCase()}</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center">
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="body2"><strong>Date:</strong> {interview.date}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="body2"><strong>Time:</strong> {interview.start_time} - {interview.end_time}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="body2"><strong>Location:</strong> {interview.interview_location}</Typography>
                </Box>
                {interview.meeting_link && (
                  <Box display="flex" alignItems="center">
                    <LinkIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Meeting Link:</strong> <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a>
                    </Typography>
                  </Box>
                )}
                <Box display="flex" alignItems="center">
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography variant="body2"><strong>Additional Details:</strong> {interview.additional_details}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="body2"><strong>Status:</strong> {interview.status}</Typography>
                </Box>
                {interview.feedback && (
                  <Box display="flex" alignItems="center">
                    <FeedbackIcon sx={{ mr: 1 }} />
                    <Typography variant="body2"><strong>Feedback:</strong> {interview.feedback}</Typography>
                  </Box>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default InterviewCard;