import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Select, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { availableSkills } from '../../globals';
import UsernameField from '../../components/fields/Registration/UsernameField';
import PasswordField from '../../components/fields/Registration/PasswordField';
import EmailField from '../../components/fields/Registration/EmailField';
import FullNameField from '../../components/fields/Registration/FullNameField';
import ContactPhoneField from '../../components/fields/Registration/ContactPhoneField';
import DateOfBirthField from '../../components/fields/Registration/DateOfBirthField';
import EmergencyContactNameField from '../../components/fields/Registration/EmergencyContactNameField';
import EmergencyContactPhoneField from '../../components/fields/Registration/EmergencyContactPhoneField';
import LinkedInProfileField from '../../components/fields/Registration/LinkedInProfileField';
import GitHubProfileField from '../../components/fields/Registration/GitHubProfileField';
import SummaryField from '../../components/fields/Registration/SummaryField';
import SkillsField from '../../components/fields/Registration/SkillsField';
import AccessibilityRequirementsField from '../../components/fields/Registration/AccessibilityRequirementsField';
import CompanyNameField from '../../components/fields/Registration/CompanyNameField';
import IndustryField from '../../components/fields/Registration/IndustryField';
import LocationField from '../../components/fields/Registration/LocationField';
import WebsiteUrlField from '../../components/fields/Registration/WebsiteUrlField';
import LogoUrlField from '../../components/fields/Registration/LogoUrlField';
import DescriptionField from '../../components/fields/Registration/DescriptionField';
import WorkExperienceField from '../../components/fields/Registration/WorkExperienceField';
import QualificationsField from '../../components/fields/Registration/QualificationsField';
import ImmigrationStatusField from '../../components/fields/Registration/ImmigrationStatusField';
import ProfilePictureField from '../../components/fields/Registration/ProfilePictureField'; 
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../globalState/globalState';

const userTypes = ['Candidate', 'Employer', 'Hiring Coordinator', 'Case Worker'];

interface FormData {
  username: string;
  password: string;
  email: string;
  role: string;
  profile_picture?: File;
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
  const navigate = useNavigate();
  const { userType, setUserType } = useGlobalState();
  const [formData, setFormData] = useState<FormData>({ username: '', password: '', email: '', role: '', profile_picture: undefined });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [editQualificationIndex, setEditQualificationIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    const { name, value, files } = event.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
          profile_picture: formData.profile_picture, // Ensure the key is 'profile_picture'
          full_name: formData.full_name,
          contact_phone: formData.contact_phone,
          date_of_birth: formData.date_of_birth,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          linkedin_profile: formData.linkedin_profile,
          github_profile: formData.github_profile,
          summary: formData.summary,
          skills: selectedSkills,
          qualifications: JSON.stringify(qualifications), // Convert to JSON string
          workExperiences: JSON.stringify(workExperiences), // Convert to JSON string
          accessibility_requirements: formData.accessibility_requirements,
          immigration_status: formData.immigration_status,
        };
      case 'Employer':
        return {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          company_name: formData.company_name,
          industry: formData.industry,
          contact_phone: formData.contact_phone,
          location: formData.location,
          website_url: formData.website_url,
          logo: formData.logo, // Ensure the key is 'logo'
          description: formData.description,
        };
      case 'Hiring Coordinator':
      case 'Case Worker':
        return {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          full_name: formData.full_name,
        };
      default:
        return filteredData;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filteredData = filterFormDataByUserType();
    const formDataToSend = new FormData();

    // Explicitly type the filteredData object
    const typedFilteredData: { [key: string]: any } = filteredData;

    Object.keys(typedFilteredData).forEach(key => {
      if (typedFilteredData[key] !== undefined) {
        formDataToSend.append(key, typedFilteredData[key]);
      }
    });

    console.log('Form data to send:');
    formDataToSend.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    let url = '';
    switch (userType) {
      case 'Candidate':
        url = 'http://localhost:8000/auth/register/candidate/';
        break;
      case 'Employer':
        url = 'http://localhost:8000/auth/register/employer/';
        break;
      case 'Hiring Coordinator':
        url = 'http://localhost:8000/auth/register/hiring-coordinator/';
        break;
      case 'Case Worker':
        url = 'http://localhost:8000/auth/register/case-worker/';
        break;
      default:
        console.error('Invalid user type');
        return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "An unexpected error occurred.");
      }

      const result = await response.json();
      console.log(`${userType} registration response:`, result);

      // Clear error message and redirect to login page
      setErrorMessage(null);
      navigate('/');
    } catch (error) {
      console.error(`Error during ${userType} registration:`, error);
      if (error instanceof Error) {
        setErrorMessage(`Registration failed: ${error.message}`);
      } else {
        setErrorMessage("An unexpected error occurred during registration.");
      }
    }
  };

  const renderAdditionalFields = () => {
    switch (userType) {
      case 'Candidate':
        return (
          <>
            <ProfilePictureField
              value={formData.profile_picture || undefined} // Change to undefined
              onChange={(e) => setFormData({ ...formData, profile_picture: e.target.files?.[0] })} // No need to handle null
              error={errors.profile_picture}
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
            <ContactPhoneField  // Added ContactPhoneField
              value={formData.contact_phone || ''}
              onChange={handleInputChange}
              error={errors.contact_phone}
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
              value={formData.logo || ''}
              onChange={handleInputChange}
              error={errors.logo}
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
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Registration;