import React from 'react';
import { Grid } from '@mui/material';
import InterviewCard from './InterviewCard';

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

interface InterviewListProps {
  interviews: Interview[];
  editMode: { [key: number]: boolean };
  editableInterview: Partial<Interview>;
  handleChange: (field: keyof Interview, value: string | null) => void;
  handleSaveClick: (id: number) => void;
  handleCancelClick: (id: number) => void;
  handleEditClick: (interview: Interview) => void;
  handleCancelInterview: (id: number) => void;
  handleCloseInterview: (id: number, feedback: string) => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ interviews, editMode, editableInterview, handleChange, handleSaveClick, handleCancelClick, handleEditClick, handleCancelInterview, handleCloseInterview }) => {
  return (
    <Grid container spacing={3}>
      {interviews.map((interview) => (
        <Grid item xs={12} key={interview.id}>
          <InterviewCard
            interview={interview}
            isEditMode={editMode[interview.id]}
            editableInterview={editableInterview}
            handleChange={handleChange}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            handleEditClick={handleEditClick}
            handleCancelInterview={handleCancelInterview}
            handleCloseInterview={handleCloseInterview}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default InterviewList;