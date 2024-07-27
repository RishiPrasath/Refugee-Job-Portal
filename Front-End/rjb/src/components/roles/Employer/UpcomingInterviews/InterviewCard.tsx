import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, MenuItem, Select, FormControl, Modal } from '@mui/material';
import { AccessTime, Event, LocationOn, Link, Info, CheckCircle, Feedback, Work, Phone, Email, AccountCircle, Edit, Cancel, Check, Delete } from '@mui/icons-material';

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

interface InterviewCardProps {
  interview: Interview;
  isEditMode: boolean;
  editableInterview: Partial<Interview>;
  handleChange: (field: keyof Interview, value: string | null) => void;
  handleSaveClick: (id: number) => void;
  handleCancelClick: (id: number) => void;
  handleEditClick: (interview: Interview) => void;
  handleCancelInterview: (id: number) => void;
  handleCloseInterview: (id: number, feedback: string) => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  isEditMode,
  editableInterview,
  handleChange,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  handleCancelInterview,
  handleCloseInterview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = () => {
    handleCloseInterview(interview.id, feedback);
    handleCloseModal();
  };

  return (
    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', position: 'relative' }}>
      {interview.candidate_profile_pic && (
        <Avatar
          alt={interview.candidate_full_name}
          src={interview.candidate_profile_pic}
          sx={{ width: 150, height: 150, position: 'absolute', top: 16, right: 16 }}
        />
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <AccountCircle sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Name:</strong></Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 4 }}>{interview.candidate_full_name}</Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Phone sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Contact Number:</strong></Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 4 }}>{interview.candidate_phone}</Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Email sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Email:</strong></Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 4 }}>{interview.candidate_email}</Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Work sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Interview Type:</strong></Typography>
          </Box>
          {isEditMode ? (
            <FormControl sx={{ ml: 4 }}>
              <Select
                value={editableInterview.interview_type || ''}
                onChange={(e) => handleChange('interview_type', e.target.value)}
              >
                <MenuItem value="in-person">In-Person</MenuItem>
                <MenuItem value="virtual">Virtual</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.interview_type}</Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Event sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Date:</strong></Typography>
          </Box>
          {isEditMode ? (
            <TextField
              type="date"
              value={editableInterview.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              sx={{ ml: 4 }}
            />
          ) : (
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.date}</Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Start Time:</strong></Typography>
          </Box>
          {isEditMode ? (
            <TextField
              type="time"
              value={editableInterview.start_time || ''}
              onChange={(e) => handleChange('start_time', e.target.value)}
              sx={{ ml: 4 }}
              fullWidth
            />
          ) : (
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.start_time}</Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>End Time:</strong></Typography>
          </Box>
          {isEditMode ? (
            <TextField
              type="time"
              value={editableInterview.end_time || ''}
              onChange={(e) => handleChange('end_time', e.target.value)}
              sx={{ ml: 4 }}
              fullWidth
            />
          ) : (
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.end_time}</Typography>
          )}
        </Box>
        {editableInterview.interview_type === 'in-person' && (
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Location:</strong></Typography>
            </Box>
            {isEditMode ? (
              <TextField
                value={editableInterview.interview_location || ''}
                onChange={(e) => handleChange('interview_location', e.target.value)}
                sx={{ ml: 4 }}
              />
            ) : (
              <Typography variant="body2" sx={{ ml: 4 }}>{interview.interview_location}</Typography>
            )}
          </Box>
        )}
        {editableInterview.interview_type === 'virtual' && (
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <Link sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Meeting Link:</strong></Typography>
            </Box>
            {isEditMode ? (
              <TextField
                value={editableInterview.meeting_link || ''}
                onChange={(e) => handleChange('meeting_link', e.target.value)}
                sx={{ ml: 4 }}
              />
            ) : (
              <Typography variant="body2" sx={{ ml: 4 }}>
                <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a>
              </Typography>
            )}
          </Box>
        )}
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Info sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Additional Details:</strong></Typography>
          </Box>
          {isEditMode ? (
            <TextField
              value={editableInterview.additional_details || ''}
              onChange={(e) => handleChange('additional_details', e.target.value)}
              sx={{ ml: 4 }}
            />
          ) : (
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.additional_details}</Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <CheckCircle sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Status:</strong></Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 4 }}>{interview.status}</Typography>
        </Box>
        {interview.feedback && (
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <Feedback sx={{ mr: 1 }} />
              <Typography variant="body2"><strong>Feedback:</strong></Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 4 }}>{interview.feedback}</Typography>
          </Box>
        )}
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Work sx={{ mr: 1 }} />
            <Typography variant="body2"><strong>Job Title:</strong></Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 4 }}>{interview.job_title}</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
          {isEditMode ? (
            <>
              <Button variant="contained" color="primary" startIcon={<Check />} onClick={() => handleSaveClick(interview.id)}>
                Save
              </Button>
              <Button variant="contained" color="error" startIcon={<Cancel />} onClick={() => handleCancelClick(interview.id)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" startIcon={<Edit />} onClick={() => handleEditClick(interview)}>
                Edit
              </Button>
              <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => handleCancelInterview(interview.id)}>
                Cancel Interview
              </Button>
              <Button variant="contained" color="success" startIcon={<Check />} onClick={handleOpenModal}>
                End Interview
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            End Interview
          </Typography>
          <TextField
            label="Feedback"
            multiline
            rows={4}
            value={feedback}
            onChange={handleFeedbackChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmitFeedback}>
              Submit
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default InterviewCard;