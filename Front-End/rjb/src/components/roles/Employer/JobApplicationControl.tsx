import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CandidateProfileSection from './JobApplicationControl/CandidateProfileSection';
import ApplicationCard from './JobApplicationControl/ApplicationCard';
import InterviewCard from './JobApplicationControl/InterviewCard';
import JobOfferComponent from './JobApplicationControl/JobOfferComponent';
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

interface JobOffer {
  job_offer_document: string;
  additional_details: string;
  offer_datetime: string;
  status: string;
}

const JobApplicationControl: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const globalState = useGlobalState();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState<Interview[]>([]);
  const [rescheduledInterviews, setRescheduledInterviews] = useState<Interview[]>([]);
  const [closedInterviews, setClosedInterviews] = useState<Interview[]>([]);
  const [cancelledInterviews, setCancelledInterviews] = useState<Interview[]>([]);
  const [interviewsFetched, setInterviewsFetched] = useState(false);
  const [expandedUpcoming, setExpandedUpcoming] = useState<string | false>(false);
  const [expandedClosed, setExpandedClosed] = useState<string | false>(false);
  const [refresh, setRefresh] = useState(false); // New state to trigger refresh
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);

  const fetchScheduledInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getInterviewsByStatus?application_id=${applicationId}&status=Scheduled`);
      const data = await response.json();
      if (response.ok) {
        setScheduledInterviews(data.interviews);
      } else {
        console.error('Error fetching Scheduled interviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Scheduled interviews:', error);
    }
  };

  const fetchRescheduledInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getInterviewsByStatus?application_id=${applicationId}&status=Rescheduled`);
      const data = await response.json();
      if (response.ok) {
        setRescheduledInterviews(data.interviews);
      } else {
        console.error('Error fetching Rescheduled interviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Rescheduled interviews:', error);
    }
  };

  const fetchClosedInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getInterviewsByStatus?application_id=${applicationId}&status=Closed`);
      const data = await response.json();
      if (response.ok) {
        setClosedInterviews(data.interviews);
      } else {
        console.error('Error fetching Closed interviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Closed interviews:', error);
    }
  };

  const fetchCancelledInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getInterviewsByStatus?application_id=${applicationId}&status=Cancelled`);
      const data = await response.json();
      if (response.ok) {
        setCancelledInterviews(data.interviews);
      } else {
        console.error('Error fetching Cancelled interviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Cancelled interviews:', error);
    }
  };

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

  const fetchJobOffer = async () => {
    try {
      const response = await fetch(`http://localhost:8000/employers/getJobOffer/${applicationId}/`);
      const data = await response.json();
      if (response.ok) {
        if (data.id) {
          setJobOffer(data);
        } else {
          console.log(data.message); // Handle the case where no job offer is associated
        }
      } else {
        console.error('Error fetching job offer:', data.error);
      }
    } catch (error) {
      console.error('Error fetching job offer:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchJobOffer();
    fetchScheduledInterviews();
    fetchRescheduledInterviews();
    fetchClosedInterviews();
    fetchCancelledInterviews();
    setInterviewsFetched(true);
  }, [applicationId, globalState, refresh]); // Add refresh to dependency array

  return (
    <Box p={3} sx={{ backgroundColor: '#ffffff' }}>
      <Typography variant="h4" gutterBottom>
        Job Application Details
      </Typography>
      {profile ? (
        <Box padding={3}>
          <CandidateProfileSection profile={profile} />
          <Box mt={3}>
            <ApplicationCard application={profile.application} onReject={() => setRefresh(!refresh)} />
          </Box>
          {jobOffer && (
            <Box mt={3}>
              <JobOfferComponent applicationId={applicationId || ''} />
            </Box>
          )}
          {interviewsFetched && (
            <Box mt={3}>
              {(scheduledInterviews.length > 0 || rescheduledInterviews.length > 0) && (
                <Accordion
                  expanded={expandedUpcoming === 'upcoming'}
                  onChange={() => setExpandedUpcoming(expandedUpcoming ? false : 'upcoming')}
                  sx={{
                    mb: 4,
                    boxShadow: 'none', // Standardized box shadow
                    '&:before': {
                      display: 'none',
                    },
                    backgroundColor: '#ffffff', // Standardized background color
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                    backgroundColor: '#ffffff', // Standardized background color
                    borderRadius: '8px 8px 0 0',
                  }}>
                    <Typography variant="h5">Scheduled/Rescheduled Interviews</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    {scheduledInterviews.map(interview => (
                      <InterviewCard key={interview.id} interview={interview} />
                    ))}
                    {rescheduledInterviews.map(interview => (
                      <InterviewCard key={interview.id} interview={interview} />
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}
              {(closedInterviews.length > 0 || cancelledInterviews.length > 0) && (
                <Accordion
                  expanded={expandedClosed === 'closed'}
                  onChange={() => setExpandedClosed(expandedClosed ? false : 'closed')}
                  sx={{
                    mb: 4,
                    boxShadow: 'none', // Standardized box shadow
                    '&:before': {
                      display: 'none',
                    },
                    backgroundColor: '#ffffff', // Standardized background color
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                    backgroundColor: '#ffffff', // Standardized background color
                    borderRadius: '8px 8px 0 0',
                  }}>
                    <Typography variant="h5">Cancelled/Closed Interviews</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    {closedInterviews.map(interview => (
                      <InterviewCard key={interview.id} interview={interview} />
                    ))}
                    {cancelledInterviews.map(interview => (
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