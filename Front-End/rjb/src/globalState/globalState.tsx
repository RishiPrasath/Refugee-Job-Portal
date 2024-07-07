import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GlobalStateContextType {
  loggedIn: boolean;
  userType: string;
  username: string;
  email: string;
  profile_picture: File | null;
  skills: string[];
  accessibility_requirements: string;
  immigration_status: string;
  full_name: string;
  company_name: string;
  setLoggedIn: (loggedIn: boolean) => void;
  setUserType: (userType: string) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setProfilePicture: (profile_picture: File | null) => void;
  setSkills: (skills: string[]) => void;
  setAccessibilityRequirements: (accessibility_requirements: string) => void;
  setImmigrationStatus: (immigration_status: string) => void;
  setFullName: (full_name: string) => void;
  setCompanyName: (company_name: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profile_picture, setProfilePicture] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [accessibility_requirements, setAccessibilityRequirements] = useState<string>('');
  const [immigration_status, setImmigrationStatus] = useState<string>('');
  const [full_name, setFullName] = useState<string>('');
  const [company_name, setCompanyName] = useState<string>('');

  return (
    <GlobalStateContext.Provider value={{
      loggedIn,
      userType,
      username,
      email,
      profile_picture,
      skills,
      accessibility_requirements,
      immigration_status,
      full_name,
      company_name,
      setLoggedIn,
      setUserType,
      setUsername,
      setEmail,
      setProfilePicture,
      setSkills,
      setAccessibilityRequirements,
      setImmigrationStatus,
      setFullName,
      setCompanyName
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