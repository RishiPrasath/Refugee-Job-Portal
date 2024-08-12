import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CandidateProfile from './DisplayCandidate/CandidateProfile';
import Qualifications from './DisplayCandidate/Qualifications';
import WorkExperiences from './DisplayCandidate/WorkExperiences';
import JobOffers from './DisplayCandidate/JobOffers';
import Applications from './DisplayCandidate/Applications';
import Interviews from './DisplayCandidate/Interviews'; // Import Interviews component

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
      <Qualifications qualifications={data.qualifications} />
      <WorkExperiences workExperiences={data.work_experiences} />
      <JobOffers jobOffers={data.job_offers} />
      <Applications applications={data.job_applications} />
      <Interviews interviews={data.interviews} /> {/* Pass interviews data */}
    </div>
  );
};

export default DisplayCandidate;