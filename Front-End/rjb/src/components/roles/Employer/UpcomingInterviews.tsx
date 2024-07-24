import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../globalState/globalState';
import { Card, CardContent, Typography, Grid, Box, Button, useMediaQuery, Theme, ThemeProvider, createTheme } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import StatusIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DatePickerField from '../../fields/CreateInterview/DatePickerField';
import TimePickerField from '../../fields/CreateInterview/TimePickerField';
import InterviewTypeSelect from '../../fields/CreateInterview/InterviewTypeSelect';
import LocationField from '../../fields/CreateInterview/LocationField';
import MeetingLinkField from '../../fields/CreateInterview/MeetingLinkField';
import AdditionalDetailsField from '../../fields/CreateInterview/AdditionalDetailsField';

const theme = createTheme(); // Create a default theme

const UpcomingInterviews: React.FC = () => {
  const { email, company_name } = useGlobalState();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [editingInterview, setEditingInterview] = useState<any>(null);

  useEffect(() => {
    fetchInterviews();
  }, [email, company_name]);

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getUpcomingInterviews/?email=${email}&company_name=${company_name}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInterviews(data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleEditClick = (interview: any) => {
    setEditingInterview({
      ...interview,
      date: new Date(interview.date),
      start_time: new Date(`1970-01-01T${interview.start_time}`),
      end_time: new Date(`1970-01-01T${interview.end_time}`)
    });
  };

  const handleCancelClick = () => {
    setEditingInterview(null);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/updateInterview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingInterview,
          date: editingInterview.date.toISOString().split('T')[0],
          start_time: editingInterview.start_time.toTimeString().split(' ')[0],
          end_time: editingInterview.end_time.toTimeString().split(' ')[0],
          status: 'Rescheduled',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchInterviews();
      setEditingInterview(null);
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const handleCancelInterview = async (interviewId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/employers/cancelInterview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: interviewId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchInterviews();
    } catch (error) {
      console.error('Error cancelling interview:', error);
    }
  };

  const InterviewCard: React.FC<{ interview: any }> = ({ interview }) => {
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">{label}</Typography>
          <Typography variant="body2">{value}</Typography>
        </Box>
      </Box>
    );

    return (
      <Card style={{ marginBottom: '1rem', padding: '1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <CardContent>
          <Grid container spacing={2}>
            {editingInterview && editingInterview.id === interview.id ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12}>
                  <InterviewTypeSelect
                    value={editingInterview.interview_type}
                    onChange={(value) => setEditingInterview({ ...editingInterview, interview_type: value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePickerField
                    value={editingInterview.date}
                    onChange={(date) => setEditingInterview({ ...editingInterview, date })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePickerField
                    label="Start Time"
                    value={editingInterview.start_time}
                    onChange={(time) => setEditingInterview({ ...editingInterview, start_time: time })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePickerField
                    label="End Time"
                    value={editingInterview.end_time}
                    onChange={(time) => setEditingInterview({ ...editingInterview, end_time: time })}
                  />
                </Grid>
                {editingInterview.interview_type === 'in-person' && (
                  <Grid item xs={12}>
                    <LocationField
                      value={editingInterview.interview_location}
                      onChange={(value) => setEditingInterview({ ...editingInterview, interview_location: value })}
                    />
                  </Grid>
                )}
                {editingInterview.interview_type === 'virtual' && (
                  <Grid item xs={12}>
                    <MeetingLinkField
                      value={editingInterview.meeting_link}
                      onChange={(value) => setEditingInterview({ ...editingInterview, meeting_link: value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AdditionalDetailsField
                    value={editingInterview.additional_details}
                    onChange={(value) => setEditingInterview({ ...editingInterview, additional_details: value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginRight: '1rem' }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </Grid>
              </LocalizationProvider>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <InfoItem icon={<WorkIcon />} label="Job Title" value={interview.job_title} />
                  <InfoItem icon={<PersonIcon />} label="Candidate" value={interview.candidate_full_name} />
                  <InfoItem icon={<PhoneIcon />} label="Phone" value={interview.candidate_phone} />
                  <InfoItem icon={<EmailIcon />} label="Email" value={interview.candidate_email} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem 
                    icon={<EventIcon />} 
                    label="Date & Time" 
                    value={`${new Date(interview.date).toLocaleDateString()} ${new Date(`1970-01-01T${interview.start_time}`).toLocaleTimeString()} - ${new Date(`1970-01-01T${interview.end_time}`).toLocaleTimeString()}`} 
                  />
                  {interview.interview_type === 'in-person' && (
                    <InfoItem icon={<LocationOnIcon />} label="Location" value={interview.interview_location} />
                  )}
                  {interview.interview_type === 'virtual' && (
                    <InfoItem icon={<LinkIcon />} label="Meeting Link" value={interview.meeting_link} />
                  )}
                  <InfoItem icon={<NotesIcon />} label="Additional Details" value={interview.additional_details} />
                  <InfoItem icon={<StatusIcon />} label="Status" value={interview.status} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(interview)} style={{ marginRight: '1rem' }} startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleCancelInterview(interview.id)} 
                    startIcon={<CancelIcon />}
                    sx={{ 
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    Cancel Interview
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h4" gutterBottom>
          Upcoming Interviews
        </Typography>
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))
        ) : (
          <Typography>No upcoming interviews found.</Typography>
        )}
      </div>
    </ThemeProvider>
  );
};

export default UpcomingInterviews;