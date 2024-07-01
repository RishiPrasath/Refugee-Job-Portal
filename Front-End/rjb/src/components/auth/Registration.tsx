import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Select, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { availableSkills } from '../../globals';
import UsernameField from '../fields/UsernameField';
import PasswordField from '../fields/PasswordField';
import EmailField from '../fields/EmailField';
import FullNameField from '../fields/FullNameField';
import ContactPhoneField from '../fields/ContactPhoneField';
import DateOfBirthField from '../fields/DateOfBirthField';
import EmergencyContactNameField from '../fields/EmergencyContactNameField';
import EmergencyContactPhoneField from '../fields/EmergencyContactPhoneField';
import LinkedInProfileField from '../fields/LinkedInProfileField';
import GitHubProfileField from '../fields/GitHubProfileField';
import SummaryField from '../fields/SummaryField';
import SkillsField from '../fields/SkillsField';
import AccessibilityRequirementsField from '../fields/AccessibilityRequirementsField';
import CompanyNameField from '../fields/CompanyNameField';
import IndustryField from '../fields/IndustryField';
import LocationField from '../fields/LocationField';
import WebsiteUrlField from '../fields/WebsiteUrlField';
import LogoUrlField from '../fields/LogoUrlField';
import DescriptionField from '../fields/DescriptionField';
import WorkExperienceField from '../fields/WorkExperienceField';
import QualificationsField from '../fields/QualificationsField';
import ImmigrationStatusField from '../fields/ImmigrationStatusField';
import ProfilePictureField from '../fields/ProfilePictureField'; // Import the new field

const userTypes = ['Candidate', 'Employer', 'Hiring Coordinator', 'Case Worker'];

interface FormData {
  username: string;
  password: string;
  email: string;
  role: string;
  profilePicture?: string;
  skills?: string[];
  workExperiences?: WorkExperience[];
  qualifications?: Qualification[];
  [key: string]: any;
}

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  skills: string[];
  description: string;
}

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  startYear: string;
  endYear: string;
}

const Registration: React.FC = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState<FormData>({ username: '', password: '', email: '', role: '', profilePicture: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [editQualificationIndex, setEditQualificationIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added setErrorMessage state

  // Handler to update work experiences
  const handleWorkExperienceChange = (index: number, updatedExperience: WorkExperience) => {
    const newExperiences = [...workExperiences];
    newExperiences[index] = updatedExperience;
    setWorkExperiences(newExperiences);
  };

  // Update the handleEditExperience function to match the expected signature
  const handleEditExperience = (index: number, field: string, value: any) => {
    const newExperiences = [...workExperiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setWorkExperiences(newExperiences);
  };

  // Handler to update qualifications
  const handleEditQualification = (index: number, field: string, value: any) => {
    const newQualifications = [...qualifications];
    newQualifications[index] = { ...newQualifications[index], [field]: value };
    setQualifications(newQualifications);
  };

  useEffect(() => {
    console.log('Component: Registration');
  }, []);

  const handleUserTypeChange = (event: SelectChangeEvent<string>) => {
    const newUserType = event.target.value;
    setUserType(newUserType);
    setFormData(prevFormData => ({
      ...prevFormData,
      role: newUserType  // Assuming you want to store the user type in the 'role' field of formData
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmergencyContactPhone = (phone: string) => {
    if (!phone) return 'Emergency contact phone number is required';
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) return 'Emergency contact phone number must be a valid phone number';
    return '';
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let error = '';

    if (name === 'emergency_contact_name' && value) {
      if (!formData.emergency_contact_phone) {
        error = 'Emergency contact phone number is required if name is provided';
      }
    }

    if (name === 'emergency_contact_phone' && formData.emergency_contact_name) {
      error = validateEmergencyContactPhone(value);
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSkillsChange = (event: any, value: string[]) => {
    setSelectedSkills(value);
    setFormData({ ...formData, skills: value });
  };

  const handleAddExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now(),
      company: '',
      role: '',
      startYear: '',
      endYear: '',
      skills: [],
      description: ''
    };
    setWorkExperiences([...workExperiences, newExperience]);
    setEditIndex(workExperiences.length);
  };

  const handleSaveExperienceEdit = () => {
    setEditIndex(null);
  };

  const handleCancelExperienceEdit = () => {
    if (editIndex !== null) {
      const currentExperience = workExperiences[editIndex];
      if (!currentExperience.company && !currentExperience.role && !currentExperience.startYear && !currentExperience.endYear && !currentExperience.skills.length && !currentExperience.description) {
        handleRemoveExperience(editIndex);
      }
    }
    setEditIndex(null);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(newExperiences);
  };

  const handleAddQualification = () => {
    const newQualification: Qualification = {
      id: Date.now(),
      school: '',
      qualification: '',
      startYear: '',
      endYear: ''
    };
    setQualifications([...qualifications, newQualification]);
    setEditQualificationIndex(qualifications.length);
  };

  const handleSaveQualificationEdit = () => {
    setEditQualificationIndex(null);
  };

  const handleCancelQualificationEdit = () => {
    if (editQualificationIndex !== null) {
      const currentQualification = qualifications[editQualificationIndex];
      if (!currentQualification.school && !currentQualification.qualification && !currentQualification.startYear && !currentQualification.endYear) {
        handleRemoveQualification(editQualificationIndex);
      }
    }
    setEditQualificationIndex(null);
  };

  const handleRemoveQualification = (index: number) => {
    const newQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(newQualifications);
  };

  const filterFormDataByUserType = () => {
    const filteredData = { ...formData };

    switch (userType) {
      case 'Candidate':
        return {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          profilePicture: formData.profilePicture,
          full_name: formData.full_name,
          contact_phone: formData.contact_phone,
          date_of_birth: formData.date_of_birth,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          linkedin_profile: formData.linkedin_profile,
          github_profile: formData.github_profile,
          summary: formData.summary,
          skills: selectedSkills,
          qualifications: qualifications,
          workExperiences: workExperiences,
          accessibility_requirements: formData.accessibility_requirements,
          immigration_status: formData.immigration_status, // Add immigration status to form data
        };
      case 'Employer':
        return {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          profilePicture: formData.profilePicture,
          company_name: formData.company_name,
          industry: formData.industry,
          location: formData.location,
          website_url: formData.website_url,
          logo_url: formData.logo_url,
          description: formData.description,
        };
      case 'Hiring Coordinator':
      case 'Case Worker':
        return {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          profilePicture: formData.profilePicture,
          full_name: formData.full_name,
        };
      default:
        return filteredData;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create a full form data object including work experiences and qualifications
    const fullFormData = filterFormDataByUserType();

    console.log(fullFormData);
  };

  const renderAdditionalFields = () => {
    switch (userType) {
      case 'Candidate':
        return (
          <>
            <ProfilePictureField
              value={formData.profilePicture || ''}
              onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
              error={errors.profilePicture}
            />
            <ImmigrationStatusField
              value={formData.immigration_status || ''}
              onChange={(e) => setFormData({ ...formData, immigration_status: e.target.value })}
              error={errors.immigration_status}
            />
            <FullNameField
              value={formData.full_name || ''}
              onChange={handleInputChange}
              error={errors.full_name}
            />
            <ContactPhoneField
              value={formData.contact_phone || ''}
              onChange={handleInputChange}
              error={errors.contact_phone}
            />
            <DateOfBirthField
              value={formData.date_of_birth || ''}
              onChange={handleInputChange}
              error={errors.date_of_birth}
            />
            <EmergencyContactNameField
              value={formData.emergency_contact_name || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.emergency_contact_name}
            />
            <EmergencyContactPhoneField
              value={formData.emergency_contact_phone || ''}
              onChange={handleInputChange}
              error={errors.emergency_contact_phone}
              onBlur={handleBlur}
            />
            <LinkedInProfileField
              value={formData.linkedin_profile || ''}
              onChange={handleInputChange}
              error={errors.linkedin_profile}
            />
            <GitHubProfileField
              value={formData.github_profile || ''}
              onChange={handleInputChange}
              error={errors.github_profile}
            />
            <SummaryField
              value={formData.summary || ''}
              onChange={handleInputChange}
              error={errors.summary}
            />
            <SkillsField
              value={selectedSkills}
              onChange={handleSkillsChange}
              error={errors.skills}
              availableSkills={availableSkills}
            />
            <QualificationsField
              qualifications={qualifications}
              handleAddQualification={handleAddQualification}
              handleEditQualification={handleEditQualification}
              handleRemoveQualification={handleRemoveQualification}
              editIndex={editQualificationIndex}
              setEditIndex={setEditQualificationIndex}
              handleSaveEdit={handleSaveQualificationEdit}
              handleCancelEdit={handleCancelQualificationEdit}
            />
            <>
              <Typography variant="h6" gutterBottom>
                Work Experience
              </Typography>
              <Button onClick={handleAddExperience} color="primary" variant="contained" sx={{ mt: 2, mb: 2 }}>Add Work Experience</Button>
              {workExperiences.map((experience, index) => (
                <WorkExperienceField
                  key={experience.id}
                  experience={experience}
                  index={index}
                  editIndex={editIndex}
                  setEditIndex={setEditIndex}
                  handleEditExperience={handleEditExperience}
                  handleSaveEdit={handleSaveExperienceEdit}
                  handleCancelEdit={handleCancelExperienceEdit}
                  handleRemoveExperience={handleRemoveExperience}
                />
              ))}
            </>
            <AccessibilityRequirementsField
              value={formData.accessibility_requirements || ''}
              onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}  // Convert to unknown first
              error={errors.accessibility_requirements}
            />
          </>
        );
      case 'Employer':
        return (
          <>
            <CompanyNameField
              value={formData.company_name || ''}
              onChange={handleInputChange}
              error={errors.company_name}
              onBlur={handleBlur}
              setErrorMessage={setErrorMessage}  // Added setErrorMessage
            />
            <IndustryField
              value={formData.industry || ''}
              onChange={handleInputChange}
              error={errors.industry}
            />
            <LocationField
              value={formData.location || ''}
              onChange={handleInputChange}
              error={errors.location}
            />
            <WebsiteUrlField
              value={formData.website_url || ''}
              onChange={handleInputChange}
              error={errors.website_url}
            />
            <LogoUrlField
              value={formData.logo_url || ''}
              onChange={handleInputChange}
              error={errors.logo_url}
            />
            <DescriptionField
              value={formData.description || ''}
              onChange={handleInputChange}
              error={errors.description}
            />
          </>
        );
      case 'Hiring Coordinator':
      case 'Case Worker':
        return (
          <>
            <FullNameField
              value={formData.full_name || ''}
              onChange={handleInputChange}
              error={errors.full_name}
            />
          </>
        );
      default:
        return null;
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
        Registration
      </Typography>
      <Box
        component="form"
        sx={{ mt: 3, width: '100%', maxWidth: 360 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="userType-label">User Type</InputLabel>
          <Select
            labelId="userType-label"
            id="userType"
            value={userType}
            label="User Type"
            onChange={handleUserTypeChange}
          >
            {userTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {userType && (
          <>
            <EmailField
              value={formData.email || ''}
              onChange={handleInputChange}
              error={errors.email}
            />
          </>
        )}
        <UsernameField
          value={formData.username || ''}
          onChange={handleInputChange}
          error={errors.username}
        />
        <PasswordField
          value={formData.password || ''}
          onChange={handleInputChange}
          error={errors.password}
        />
        {renderAdditionalFields()}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Registration;