import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Grid, Avatar, Chip, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SkillIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import CandidateProfileSection from './JobApplicationControl/CandidateProfileSection';
import ApplicationCard from './JobApplicationControl/ApplicationCard';
import ActionButtons from './JobApplicationControl/ActionButtons';
import InterviewCard from './JobApplicationControl/InterviewCard';
import { useGlobalState } from '../../../globalState/globalState';

interface CandidateProfile {
  full_name: string;
  email: string;
  immigration_status: string;
  accessibility_requirements: string | null;
  contact_phone: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  linkedin_profile: string;
  github_profile: string;
  summary: string;
  skills: string[];
  qualifications: Qualification[];
  workExperiences: WorkExperience[];
  profile_picture: string | null;
  status: string;
  application: Application;
  company_name: string;
}

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  start_year: number;
  end_year: number;
  candidate_id: number;
}

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  start_year: number;
  end_year: number;
  description: string;
  candidate_id: number;
}

interface Application {
  id: number;
  cover_letter: string | null;
  cv_url: string | null;
  status: string;
  created_at: string;
}

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
}

const JobApplicationControl: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const globalState = useGlobalState();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [closedInterviews, setClosedInterviews] = useState<Interview[]>([]);
  const [interviewsFetched, setInterviewsFetched] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/employers/getCandidateApplicationDetails/${applicationId}/`);
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          setProfileFetched(true); // Set profile fetched to true
        } else {
          console.error('Error fetching profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [applicationId, globalState]);

  useEffect(() => {
    const fetchInterviews = async (status: string) => {
      if (!applicationId) return;
      try {
        const response = await fetch(`http://localhost:8000/employers/getInterviewsByStatus/?application_id=${applicationId}&status=${status}`);
        const data = await response.json();
        if (response.ok) {

          console.log("Interviews:", data.interviews);

          if (status === 'Scheduled' || status === 'Rescheduled') setUpcomingInterviews(data.interviews);
          else if (status === 'Cancelled' || status === 'Closed') setClosedInterviews(data.interviews);
        } else {
          console.error('Error fetching interviews:', data.error);
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setInterviewsFetched(true);
      }
    };

    if (profileFetched) { // Only fetch interviews if profile is fetched
      fetchInterviews('Scheduled');
      fetchInterviews('Rescheduled');
      fetchInterviews('Cancelled');
      fetchInterviews('Closed');
    }
  }, [applicationId, profileFetched]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Application Details
      </Typography>
      {profile ? (
        <Box padding={3}>
          <CandidateProfileSection profile={profile} />
          <Box mt={3}>
            <ApplicationCard application={profile.application} />
          </Box>
          <Box mt={3}>
            <ActionButtons applicationId={applicationId || ''} />
          </Box>
          {interviewsFetched && (
            <Box mt={3}>
              {upcomingInterviews.length > 0 && (
                <Accordion sx={{
                  mb: 4,
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                  backgroundColor: '#ffffff', // Changed to white
                }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '8px 8px 0 0',
                  }}>
                    <Typography variant="h5">Scheduled/Rescheduled Interviews</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {upcomingInterviews.map(interview => (
                      <InterviewCard key={interview.id} interview={interview} />
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}
              {closedInterviews.length > 0 && (
                <Accordion sx={{
                  mb: 4,
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                  backgroundColor: '#ffffff', // Changed to white
                }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '8px 8px 0 0',
                  }}>
                    <Typography variant="h5">Cancelled/Closed Interviews</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {closedInterviews.map(interview => (
                      <InterviewCard key={interview.id} interview={interview} />
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </Box>
      ) : <Typography>Loading...</Typography>}
    </Box>
  );
};

export default JobApplicationControl;