import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useGlobalState } from '../../../globalState/globalState';
import ProfileHeader from './CandidateProfile/ProfileHeader';
import Qualifications from './CandidateProfile/Qualifications';
import WorkExperiences from './CandidateProfile/WorkExperiences';
import CaseworkerDetails from './CandidateProfile/CaseworkerDetails';
import AppliedJobs from './CandidateProfile/AppliedJobs';
import SavedJobs from './CandidateProfile/SavedJobs';
import Skills from './CandidateProfile/Skills';

interface ProfileData {
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
  skills: Array<{ id: number; skill_name: string; description: string }>;
  qualifications: Array<{ id: number; school: string; qualification: string; start_year: number; end_year: number }>;
  workExperiences: Array<{ id: number; company: string; role: string; start_year: number; end_year: number; description: string }>;
  profile_picture: string | null;
  caseworker: {
    full_name: string;
    email: string;
  } | null;
  savedJobs: { id: number; title: string; company: string; location?: string; immigrationSalaryList?: boolean }[];
  appliedJobs: {
    id: number;
    job_title: string;
    company_name: string;
    status: string;
    date_time_applied: string;
  }[];
}

const CandidateProfile: React.FC = () => {
  const { username, email } = useGlobalState();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [savedJobs, setSavedJobs] = useState<ProfileData['savedJobs']>([]);
  const [appliedJobs, setAppliedJobs] = useState<ProfileData['appliedJobs']>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getCandidateProfile?username=${username}&email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData({
          ...data,
          savedJobs: data.savedJobs || [],
          appliedJobs: data.appliedJobs || []
        });
        console.log('Profile data:', data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getSavedJobs?username=${username}&email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch saved jobs');
        }
        const data = await response.json();
        setSavedJobs(data || []);
        console.log('Saved jobs:', data);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/getAppliedJobs?username=${username}&email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applied jobs');
        }
        const data = await response.json();
        setAppliedJobs(data || []);
        console.log('Applied jobs:', data);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      }
    };

    fetchProfileData();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, [username, email]);

  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setProfileData({
      ...updatedProfile,
      savedJobs: updatedProfile.savedJobs || [],
      appliedJobs: updatedProfile.appliedJobs || []
    });
  };

  const handleSaveSkills = (updatedSkills: ProfileData['skills']) => {
    if (profileData) {
      setProfileData({ ...profileData, skills: updatedSkills });
    }
  };

  const handleSaveWorkExperiences = (updatedWorkExperiences: ProfileData['workExperiences']) => {
    if (profileData) {
      setProfileData({ ...profileData, workExperiences: updatedWorkExperiences });
    }
  };

  const handleSaveQualifications = (updatedQualifications: ProfileData['qualifications']) => {
    if (profileData) {
      setProfileData({ ...profileData, qualifications: updatedQualifications });
    }
  };

  const handleAddQualification = (newQualification: ProfileData['qualifications'][0]) => {
    if (profileData) {
      setProfileData({ ...profileData, qualifications: [...profileData.qualifications, newQualification] });
    }
  };

  const handleDeleteQualification = (qualificationId: number) => {
    if (profileData) {
      const updatedQualifications = profileData.qualifications.filter(q => q.id !== qualificationId);
      setProfileData({ ...profileData, qualifications: updatedQualifications });
    }
  };

  return (
    <Box>
      {profileData && (
        <>
          <ProfileHeader
            profile={profileData}
            isEditing={false}
            onSave={handleSaveProfile}
            onEdit={() => {}}
          />
          <CaseworkerDetails caseworker={profileData.caseworker} />
          <Qualifications
            qualifications={profileData.qualifications}
            onSave={handleSaveQualifications}
            onAdd={handleAddQualification}
            onDelete={handleDeleteQualification}
          />
          <WorkExperiences workExperiences={profileData.workExperiences} onSave={handleSaveWorkExperiences} />
          <Skills skills={profileData.skills} onSave={handleSaveSkills} />
          <AppliedJobs appliedJobs={appliedJobs} handleCardClick={() => {}} />
          <SavedJobs savedJobs={savedJobs} handleCardClick={() => {}} />
        </>
      )}
    </Box>
  );
};

export default CandidateProfile;