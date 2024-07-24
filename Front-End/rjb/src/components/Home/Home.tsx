import React, { useEffect } from 'react';
import { useGlobalState } from '../../globalState/globalState';

type Props = {};

const Home: React.FC<Props> = () => {
  const { 
    full_name, 
    userType, 
    company_name, 
    username, 
    email, 
    profile_picture, 
    company_logo, 
    skills, 
    accessibility_requirements, 
    immigration_status, 
    assigned_case_worker // Ensure this is included
  } = useGlobalState();

  useEffect(() => {
    // Log global state variables on page load
    console.log('Global State on Home page load:', {
      full_name,
      userType,
      company_name,
      username,
      email,
      profile_picture,
      company_logo,
      skills,
      accessibility_requirements,
      immigration_status,
      assigned_case_worker // Ensure this is logged
    });
  }, [full_name, userType, company_name, username, email, profile_picture, company_logo, skills, accessibility_requirements, immigration_status, assigned_case_worker]);

  return (
    <div>
      <h1>Home Page</h1>
      {userType === 'Employer' ? (
        <div>
          <p>
            Your company is: {company_name} <br/>
            Your role is: {userType}
          </p>
          {company_logo && (
            <div>
              <img 
                src={`data:image/jpeg;base64,${company_logo}`} 
                alt="Company Logo" 
                width="300" 
                height="300" 
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <p>Welcome, {full_name}!</p>
          <p>Your role is: {userType}</p>
          {userType === 'Candidate' && (
            <>
            <p>Your assigned case worker is: {assigned_case_worker}</p> 
            <p>Your skills are: {skills.join(', ')}</p> 
            <p>Your immigration status is: {immigration_status}</p> 
            {profile_picture && (
              <div>
                <img 
                  src={`data:image/jpeg;base64,${profile_picture}`} 
                  alt="Profile" 
                  width="300" 
                  height="300" 
                />
              </div>
            )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;