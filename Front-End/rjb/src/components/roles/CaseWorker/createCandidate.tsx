import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../globalState/globalState';
import EmailField from './createCandidate/EmailField';
import UsernameField from './createCandidate/UsernameField';
import PasswordField from './createCandidate/PasswordField';
import ProfilePictureField from './createCandidate/ProfilePictureField';
import ImmigrationStatusField from './createCandidate/ImmigrationStatusField';
import FullNameField from './createCandidate/FullNameField';
import ContactPhoneField from './createCandidate/ContactPhoneField';
import DateOfBirthField from './createCandidate/DateOfBirthField';
import EmergencyContactNameField from './createCandidate/EmergencyContactNameField';
import EmergencyContactPhoneField from './createCandidate/EmergencyContactPhoneField';
import LinkedInProfileField from './createCandidate/LinkedInProfileField';
import GitHubProfileField from './createCandidate/GitHubProfileField';
import SummaryField from './createCandidate/SummaryField';
import SkillsField from './createCandidate/SkillsField';
import WorkExperienceField from './createCandidate/WorkExperienceField';
import QualificationsField from './createCandidate/QualificationsField';
import AccessibilityRequirementsField from './createCandidate/AccessibilityRequirementsField';
import { availableSkills } from '../../../globals';
import { SelectChangeEvent } from '@mui/material';

interface FormData {
  username: string;
  password: string;
  email: string;
  profile_picture?: File;
  immigration_status: string;
  full_name: string;
  contact_phone: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  linkedin_profile: string;
  github_profile: string;
  summary: string;
  skills: string[];
  workExperiences: WorkExperience[];
  qualifications: Qualification[];
  accessibility_requirements: string;
  case_worker_username: string;
  case_worker_email: string;
  [key: string]: any;
}

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  description: string;
  skills: string[];
}

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  startYear: string;
  endYear: string;
}

const CreateCandidate: React.FC = () => {
  const navigate = useNavigate();
  const { username: caseWorkerUsername, email: caseWorkerEmail } = useGlobalState();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    profile_picture: undefined,
    immigration_status: '',
    full_name: '',
    contact_phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    linkedin_profile: '',
    github_profile: '',
    summary: '',
    skills: [], // Initialize as an empty array
    workExperiences: [],
    qualifications: [],
    accessibility_requirements: '',
    case_worker_username: caseWorkerUsername,
    case_worker_email: caseWorkerEmail,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (files && files.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      skills,
    }));
  };

  const handleWorkExperiencesChange = (workExperiences: WorkExperience[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      workExperiences,
    }));
  };

  const handleQualificationsChange = (qualifications: Qualification[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      qualifications,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.contact_phone) newErrors.contact_phone = 'Contact phone is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.emergency_contact_name) newErrors.emergency_contact_name = 'Emergency contact name is required';
    if (!formData.emergency_contact_phone) newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    if (!formData.summary) newErrors.summary = 'Summary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else if (Array.isArray(formData[key])) {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    console.log("Form Data to Send: ", Object.fromEntries(formDataToSend));

    try {
      const response = await fetch('http://localhost:8000/advisors/createCandidate', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        navigate(`/candidate/${formData.email}`);
      } else {
        setErrorMessage(data.error || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('Network error');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 8 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Create Candidate
      </Typography>
      <Box
        component="form"
        sx={{ mt: 3, width: '100%', maxWidth: 360 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <UsernameField
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
        />
        <PasswordField
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
        />
        <EmailField
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />
        <ProfilePictureField
          value={formData.profile_picture}
          onChange={handleInputChange}
          error={errors.profile_picture}
        />
        <ImmigrationStatusField
          value={formData.immigration_status}
          onChange={handleSelectChange}
          error={errors.immigration_status}
        />
        <FullNameField
          value={formData.full_name}
          onChange={handleInputChange}
          error={errors.full_name}
        />
        <ContactPhoneField
          value={formData.contact_phone}
          onChange={handleInputChange}
          error={errors.contact_phone}
        />
        <DateOfBirthField
          value={formData.date_of_birth}
          onChange={handleInputChange}
          error={errors.date_of_birth}
        />
        <EmergencyContactNameField
          value={formData.emergency_contact_name}
          onChange={handleInputChange}
          error={errors.emergency_contact_name}
        />
        <EmergencyContactPhoneField
          value={formData.emergency_contact_phone}
          onChange={handleInputChange}
          error={errors.emergency_contact_phone}
        />
        <LinkedInProfileField
          value={formData.linkedin_profile}
          onChange={handleInputChange}
          error={errors.linkedin_profile}
        />
        <GitHubProfileField
          value={formData.github_profile}
          onChange={handleInputChange}
          error={errors.github_profile}
        />
        <SummaryField
          value={formData.summary}
          onChange={handleInputChange}
          error={errors.summary}
        />
        <SkillsField
          value={formData.skills}
          onChange={handleSkillsChange}
          error={errors.skills}
          availableSkills={availableSkills}
        />
        <WorkExperienceField
          value={formData.workExperiences}
          onChange={handleWorkExperiencesChange}
          error={errors.workExperiences}
        />
        <QualificationsField
          value={formData.qualifications}
          onChange={handleQualificationsChange}
          error={errors.qualifications}
        />
        <AccessibilityRequirementsField
          value={formData.accessibility_requirements}
          onChange={handleInputChange}
          error={errors.accessibility_requirements}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Candidate
        </Button>
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CreateCandidate;