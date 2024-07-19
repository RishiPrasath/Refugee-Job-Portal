import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InterviewTypeSelect from '../../fields/CreateInterview/InterviewTypeSelect';
import DatePickerField from '../../fields/CreateInterview/DatePickerField';
import TimePickerField from '../../fields/CreateInterview/TimePickerField';
import LocationField from '../../fields/CreateInterview/LocationField';
import MeetingLinkField from '../../fields/CreateInterview/MeetingLinkField';
import AdditionalDetailsField from '../../fields/CreateInterview/AdditionalDetailsField';

interface Interview {
  applicationId: string;
  interviewType: string;
  date: string; // ISO date string
  startTime: string; // ISO time string
  endTime: string; // ISO time string
  interviewLocation?: string; // Optional for virtual interviews
  meetingLink?: string; // Optional for in-person interviews
  additionalDetails?: string;
  status: string;
  feedback?: string;
}

const CreateInterview: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState<string>('in-person');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validateFields = () => {
    const newErrors: string[] = [];
    if (!date) newErrors.push('Date is required');
    if (!startTime) newErrors.push('Start time is required');
    if (!endTime) newErrors.push('End time is required');
    if (interviewType === 'in-person' && !location) newErrors.push('Location is required');
    if (interviewType === 'virtual' && !meetingLink) newErrors.push('Meeting link is required');
    return newErrors;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time: Date | null) => {
    if (!time) return '';
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateFields();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors([]);
      const interviewData: Interview = {
        applicationId: applicationId || '',
        interviewType,
        date: formatDate(date),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        interviewLocation: location,
        meetingLink,
        additionalDetails,
        status: 'Scheduled'
      };
      console.log(interviewData);

      try {
        const response = await fetch('http://localhost:8000/employers/createInterview/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(interviewData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Interview created successfully:', result);
          navigate('/upcoming-interviews');
        } else {
          const errorData = await response.json();
          console.error('Error creating interview:', errorData);
          setErrors([errorData.message || 'An error occurred while creating the interview.']);
        }
      } catch (error) {
        console.error('Error creating interview:', error);
        setErrors(['An error occurred while creating the interview.']);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom align="center">Set Up Interview</Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InterviewTypeSelect 
                    value={interviewType} 
                    onChange={(value: string) => setInterviewType(value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePickerField value={date} onChange={setDate} />
                </Grid>
                <Grid item xs={6}>
                  <TimePickerField label="Start Time" value={startTime} onChange={setStartTime} />
                </Grid>
                <Grid item xs={6}>
                  <TimePickerField label="End Time" value={endTime} onChange={setEndTime} />
                </Grid>
                {interviewType === 'in-person' && (
                  <Grid item xs={12}>
                    <LocationField value={location} onChange={setLocation} />
                  </Grid>
                )}
                {interviewType === 'virtual' && (
                  <Grid item xs={12}>
                    <MeetingLinkField value={meetingLink} onChange={setMeetingLink} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AdditionalDetailsField value={additionalDetails} onChange={setAdditionalDetails} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Schedule Interview
                  </Button>
                </Grid>
                {errors.length > 0 && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {errors.join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateInterview;