import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Profile from './EmployerView/Profile';
import JobPostings from './EmployerView/JobPostings';
import Interviews from './EmployerView/Interviews';
import Events from './EmployerView/Events';
import { useGlobalState } from '../../../globalState/globalState';


const EmployerView: React.FC = () => {
  const { employerId } = useParams<{ employerId: string }>();
  const [employerData, setEmployerData] = useState<any>(null);
  const {userID} = useGlobalState();
  useEffect(() => {

    console.log("Current user ID:", userID);



    const fetchEmployerData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/coordinators/employer_view/${employerId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEmployerData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    };

    fetchEmployerData();
  }, [employerId]);

  if (!employerData) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Profile employerData={employerData} />
        <Events events={employerData.events} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon style={{ marginRight: '8px' }} /> Job Postings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <JobPostings 
              jobPostings={employerData.job_postings} 
              companyName={employerData.company_name} 
              logoUrl={employerData.logo_url} 
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon style={{ marginRight: '8px' }} /> Interviews
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Interviews interviews={employerData.interviews} />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EmployerView;