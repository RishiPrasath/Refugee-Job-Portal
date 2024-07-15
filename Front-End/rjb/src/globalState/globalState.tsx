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
  assigned_case_worker: string;
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
  setAssignedCaseWorker: (assigned_case_worker: string) => void;
  availableSkills: string[];
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
  const [assigned_case_worker, setAssignedCaseWorker] = useState<string>('');

  const availableSkills: string[] = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'SQL', 'NoSQL', 'HTML', 'CSS',
    'C++', 'C#', 'Java', 'Go', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Rust',
    'Chemical Science', 'Biological Science', 'Archaeology', 'Graphic Design', 'Multimedia Design',
    'Laboratory Technician', 'Pharmaceutical Technician', 'Art', 'Dance', 'Music',
    'Arts Management', 'Agriculture', 'Fishing', 'Welding', 'Boat Building', 'Stonemasonry', 'Bricklaying',
    'Roofing', 'Carpentry', 'Construction', 'Retrofit', 'Care Work', 'Senior Care Work',
    'Animal Care', 'Deckhand', 'Project Management', 'Product Management', 'System Administration',
    'Network Engineering', 'Mobile Development', 'Content Writing', 'SEO', 'Marketing',
    'Sales', 'Customer Support', 'Business Analysis', 'Data Science', 'Air conditioning engineering',
    'Refrigeration technology', 'Automotive electrics', 'Vehicle mechanics', 'Bodyshop technology',
    'Aircraft maintenance', 'Marine engineering', 'Railway engineering', 'Electrical engineering',
    'Telecom engineering', 'Alarm systems engineering', 'Security systems engineering', 'Communication engineering',
    'Electronics engineering', 'Instrumentation technology', 'Optical technology', 'Watchmaking',
    'Boat building', 'Shipwright', 'Steel erection', 'Stone masonry', 'Joinery', 'Plumbing', 'Ventilation technology',
    'Glazing', 'Building maintenance', 'Plastering', 'Carpet fitting', 'Ceramic tiling', 'Upholstery',
    'Tailoring', 'Seamstress', 'Retail sales', 'Visual merchandising', 'Market research', 'Customer service',
    'Call center operations', 'Early education', 'Child care', 'Playwork', 'Animal grooming', 'Veterinary assistance',
    'Housekeeping', 'Residential care', 'Police support', 'Vehicle sales', 'Market trading', 'Mystery shopping',
    'Rail travel assistance', 'Air travel assistance', 'Bed and breakfast management', 'Construction supervision',
    'Chemical engineering', 'Mechanical engineering', 'Electrical maintenance', 'Calibration engineering',
    'Refrigeration maintenance', 'Optical instrumentation', 'Computer repair', 'IT support', 'Network installation',
    'Security systems installation', 'Fire systems installation', 'Alarm systems installation', 'CCTV installation',
    'Domestic appliance repair', 'Field engineering', 'Building construction management', 'Site supervision',
    'Property development', 'Dry stone walling', 'Chimney building', 'Gas fitting', 'Heating installation',
    'Joinery', 'Shop fitting', 'Window fitting', 'Site management', 'Construction management', 'Textile work',
    'Leather work', 'Shoe repair', 'Tailoring', 'Dressmaking', 'Machine repair', 'Process technology', 'Chemical processes'
  ];

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
      assigned_case_worker,
      setLoggedIn,
      setUserType,
      setUsername,
      setEmail,
      setProfilePicture,
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