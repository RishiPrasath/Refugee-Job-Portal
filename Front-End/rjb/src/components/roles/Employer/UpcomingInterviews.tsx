import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../globalState/globalState';
import { Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import InterviewList from './UpcomingInterviews/InterviewList';


const theme = createTheme(); // Create a default theme

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
  feedback: string;
  job_title: string;
  candidate_full_name: string;
  candidate_phone: string;
  candidate_email: string;
  candidate_profile_pic: string | null;
}

const UpcomingInterviews: React.FC = () => {
  const { company_name } = useGlobalState();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editableInterview, setEditableInterview] = useState<Partial<Interview>>({});

  useEffect(() => {
    fetchInterviews();
  }, [company_name]);

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getUpcomingInterviews/?company_name=${company_name}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setInterviews(data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleEditClick = (interview: Interview) => {
    setEditMode((prev) => ({ ...prev, [interview.id]: true }));
    setEditableInterview(interview);
  };

  const handleSaveClick = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/employers/updateInterview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableInterview),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Interview updated successfully:', data);
      setEditMode((prev) => ({ ...prev, [id]: false }));
      fetchInterviews(); // Refresh the interviews list
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const handleCancelClick = (id: number) => {
    setEditMode((prev) => ({ ...prev, [id]: false }));
    setEditableInterview({});
  };

  const handleChange = (field: keyof Interview, value: string | null) => {
    setEditableInterview((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelInterview = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/employers/cancelInterview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Interview cancelled successfully:', data);
      fetchInterviews(); // Refresh the interviews list
    } catch (error) {
      console.error('Error cancelling interview:', error);
    }
  };

  const handleCloseInterview = async (id: number, feedback: string) => {
    try {
      const response = await fetch(`http://localhost:8000/employers/closeInterview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, feedback }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Interview closed successfully:', data);
      fetchInterviews(); // Refresh the interviews list
    } catch (error) {
      console.error('Error closing interview:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Upcoming Interviews</Typography>
        <InterviewList
          interviews={interviews}
          editMode={editMode}
          editableInterview={editableInterview}
          handleChange={handleChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          handleEditClick={handleEditClick}
          handleCancelInterview={handleCancelInterview}
          handleCloseInterview={handleCloseInterview}
        />
      </Box>
    </ThemeProvider>
  );
};

export default UpcomingInterviews;