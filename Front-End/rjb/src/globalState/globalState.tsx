import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface GlobalStateContextType {
  loggedIn: boolean;
  userType: string;
  username: string;
  email: string;
  profile_picture: string | null; // Store as base64 string
  company_logo: string | null; // Store as base64 string
  skills: string[];
  accessibility_requirements: string;
  immigration_status: string;
  full_name: string;
  company_name: string;
  assigned_case_worker: string;
  setLoggedIn: (loggedIn: boolean) => void;
  setUserType: (userType: string) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setProfilePicture: (profile_picture: string | null) => void;
  setCompanyLogo: (company_logo: string | null) => void;
  setSkills: (skills: string[]) => void;
  setAccessibilityRequirements: (accessibility_requirements: string) => void;
  setImmigrationStatus: (immigration_status: string) => void;
  setFullName: (full_name: string) => void;
  setCompanyName: (company_name: string) => void;
  setAssignedCaseWorker: (assigned_case_worker: string) => void;
  availableSkills: string[];
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => JSON.parse(localStorage.getItem('loggedIn') || 'false'));
  const [userType, setUserType] = useState<string>(() => localStorage.getItem('userType') || '');
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
  const [email, setEmail] = useState<string>(() => localStorage.getItem('email') || '');
  const [profile_picture, setProfilePicture] = useState<string | null>(() => localStorage.getItem('profile_picture'));
  const [company_logo, setCompanyLogo] = useState<string | null>(() => localStorage.getItem('company_logo'));
  const [skills, setSkills] = useState<string[]>(() => JSON.parse(localStorage.getItem('skills') || '[]'));
  const [accessibility_requirements, setAccessibilityRequirements] = useState<string>(() => localStorage.getItem('accessibility_requirements') || '');
  const [immigration_status, setImmigrationStatus] = useState<string>(() => localStorage.getItem('immigration_status') || '');
  const [full_name, setFullName] = useState<string>(() => localStorage.getItem('full_name') || '');
  const [company_name, setCompanyName] = useState<string>(() => localStorage.getItem('company_name') || '');
  const [assigned_case_worker, setAssignedCaseWorker] = useState<string>(() => localStorage.getItem('assigned_case_worker') || '');

  useEffect(() => {
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
  }, [loggedIn]);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('accessibility_requirements', accessibility_requirements);
  }, [accessibility_requirements]);

  useEffect(() => {
    localStorage.setItem('immigration_status', immigration_status);
  }, [immigration_status]);

  useEffect(() => {
    localStorage.setItem('full_name', full_name);
  }, [full_name]);

  useEffect(() => {
    localStorage.setItem('company_name', company_name);
  }, [company_name]);

  useEffect(() => {
    localStorage.setItem('assigned_case_worker', assigned_case_worker);
  }, [assigned_case_worker]);

  useEffect(() => {
    if (profile_picture) {
      localStorage.setItem('profile_picture', profile_picture);
    } else {
      localStorage.removeItem('profile_picture');
    }
  }, [profile_picture]);

  useEffect(() => {
    if (company_logo) {
      localStorage.setItem('company_logo', company_logo);
    } else {
      localStorage.removeItem('company_logo');
    }
  }, [company_logo]);

  const availableSkills: string[] = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'SQL', 'NoSQL', 'HTML', 'CSS',
    // ... other skills
  ];

  return (
    <GlobalStateContext.Provider value={{
      loggedIn,
      userType,
      username,
      email,
      profile_picture,
      company_logo,
      skills,
      accessibility_requirements,
      immigration_status,
      full_name,
      company_name,
      assigned_case_worker,
      setLoggedIn,
      setUserType,
      setUsername,
      setEmail,
      setProfilePicture,
      setCompanyLogo,
      setSkills,
      setAccessibilityRequirements,
      setImmigrationStatus,
      setFullName,
      setCompanyName,
      setAssignedCaseWorker,
      availableSkills
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};