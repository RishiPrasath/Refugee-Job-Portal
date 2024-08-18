import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CandidateProfile from './DisplayCandidate/CandidateProfile';
import Qualifications from './DisplayCandidate/Qualifications';
import WorkExperiences from './DisplayCandidate/WorkExperiences';
import JobOffers from './DisplayCandidate/JobOffers';
import Applications from './DisplayCandidate/Applications';
import Interviews from './DisplayCandidate/Interviews';
import Skills from './DisplayCandidate/Skills';
import Events from './DisplayCandidate/Events';

const DisplayCandidate: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!email) {
        console.error('Email is undefined');
        setError('Email is undefined');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/advisors/getCandidateProfile?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        if (response.ok) {
          setData(data);
          console.log('Fetched data:', data);
        } else {
          setError(data.error);
          console.error('Error:', data.error);
        }
      } catch (error) {
        setError('Network error');
        console.error('Network error:', error);
      }
    };

    fetchData();
  }, [email]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Candidate Profile</h1>
      <CandidateProfile profile={data.candidate_profile} />
      {data.candidate_profile.skills && data.candidate_profile.skills.length > 0 && (
        <Skills skills={data.candidate_profile.skills} />
      )}
      {data.events && data.events.length > 0 && (
        <Events events={data.events} />
      )}
      {data.qualifications && data.qualifications.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SchoolIcon style={{ marginRight: '8px' }} />
            <Typography>Qualifications</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Qualifications qualifications={data.qualifications} />
          </AccordionDetails>
        </Accordion>
      )}
      {data.work_experiences && data.work_experiences.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <WorkIcon style={{ marginRight: '8px' }} />
            <Typography>Work Experiences</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <WorkExperiences workExperiences={data.work_experiences} />
          </AccordionDetails>
        </Accordion>
      )}
      {data.job_offers && data.job_offers.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <CardMembershipIcon style={{ marginRight: '8px' }} />
            <Typography>Job Offers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <JobOffers jobOffers={data.job_offers} />
          </AccordionDetails>
        </Accordion>
      )}
      {data.job_applications && data.job_applications.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <DescriptionIcon style={{ marginRight: '8px' }} />
            <Typography>Applications</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Applications applications={data.job_applications} />
          </AccordionDetails>
        </Accordion>
      )}
      {data.interviews && data.interviews.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <CalendarTodayIcon style={{ marginRight: '8px' }} />
            <Typography>Interviews</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Interviews interviews={data.interviews} />
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default DisplayCandidate;