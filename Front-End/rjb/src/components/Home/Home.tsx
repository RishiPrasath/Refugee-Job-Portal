import React, { useEffect } from 'react';
import { useGlobalState } from '../../globalState/globalState';

type Props = {};

const Home: React.FC<Props> = () => {
  const { full_name, userType, company_name, username, email, profile_picture, skills, accessibility_requirements, immigration_status } = useGlobalState();

  useEffect(() => {
    // Log global state variables on page load
    console.log('Global State on Home page load:', {
      full_name,
      userType,
      company_name,
      username,
      email,
      profile_picture,
      skills,
      accessibility_requirements,
      immigration_status,
    });
  }, [full_name, userType, company_name, username, email, profile_picture, skills, accessibility_requirements, immigration_status]);

  return (
    <div>
      <h1>Home Page</h1>
      {userType === 'Employer' ? (
        <p>
          Your company is: {company_name} <br/>
          Your role is: {userType}
        </p>
      ) : (
        <>
          <p>Welcome, {full_name}!</p>
          <p>Your role is: {userType}</p>
        </>
      )}
    </div>
  );
};

export default Home;
