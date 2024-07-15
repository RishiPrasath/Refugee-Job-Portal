import React, { useState } from 'react';
import { Box, Typography, Button} from '@mui/material';
import JobTitleField from '../../fields/AddJobPostings/JobTitleField';
import JobDescriptionField from '../../fields/AddJobPostings/JobDescriptionField';
import RequirementsField from '../../fields/AddJobPostings/RequirementsField';
import LocationField from '../../fields/AddJobPostings/LocationField';
import CompensationAmountField from '../../fields/AddJobPostings/CompensationAmountField';
import CompensationTypeField from '../../fields/AddJobPostings/CompensationTypeField';
import JobTypeField from '../../fields/AddJobPostings/JobTypeField';
import EmploymentTermField from '../../fields/AddJobPostings/EmploymentTermField';
import ISLField from '../../fields/AddJobPostings/ISLField';
import SkillsField from '../../fields/AddJobPostings/SkillsField';
import { useGlobalState } from '../../../globalState/globalState';
import { useEffect } from 'react';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import ChecklistIcon from '@mui/icons-material/Checklist';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';

const AddJobPostings: React.FC = () => {
  const navigate = useNavigate();
  const { availableSkills, username, company_name, email } = useGlobalState();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [compensationAmount, setCompensationAmount] = useState<number | null>(null);
  const [compensationType, setCompensationType] = useState('');
  const [jobType, setJobType] = useState('');
  const [employmentTerm, setEmploymentTerm] = useState('');
  const [ISL, setISL] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    console.log('Username:', username);
  }, [username]);

  const [errors, setErrors] = useState({
    jobTitle: '',
    jobDescription: '',
    requirements: '',
    location: '',
    compensationAmount: '',
    compensationType: '',
    jobType: '',
    employmentTerm: '',
    skills: '',
  });

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };

  const validateField = (name: string, value: any): boolean => {
    let error = '';
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
      error = 'This field is required';
    }
    // Handle boolean fields, which should not be considered invalid when false
    if (typeof value === 'boolean') {
      error = ''; // Clear any error for boolean as they are valid whether true or false
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === '';
  };

  const handleBlur = (name: string, value: any) => {
    validateField(name, value);
  };

  const handleRequirementBlur = (index: number, value: string) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        requirements: 'All requirements must be filled',
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (requirements.every((req) => req)) {
          newErrors.requirements = '';
        }
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    console.log('Form data:', {
        jobTitle,
        jobDescription,
        requirements,
        location,
        compensationAmount,
        compensationType,
        jobType,
        employmentTerm,
        ISL,
        skills,
        company_name,
        email
    });
    
    try {
        const response = await fetch('http://localhost:8000/employers/addJobPosting/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobTitle,
                jobDescription,
                requirements,
                location,
                compensationAmount,
                compensationType,
                jobType,
                employmentTerm,
                ISL,
                skills,
                company_name,
                email
            }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Job posting successful:', data);
            navigate('/viewjobpostings'); // Redirect to ViewJobPostings
        } else {
            console.error('Job posting failed:', data.message);
        }
    } catch (error) {
        console.error('Error during job posting:', error);
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
        Add Job Postings
      </Typography>
      <Box
        component="form"
        sx={{ mt: 3, width: '100%', maxWidth: 600 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Box display="flex" alignItems="center">
          <TitleIcon sx={{ mr: 1 }} />
          <JobTitleField
            value={jobTitle}
            onChange={setJobTitle}
            onBlur={() => handleBlur('jobTitle', jobTitle)}
          />
        </Box>
        {errors.jobTitle && <Typography color="error">{errors.jobTitle}</Typography>}
        <Box display="flex" alignItems="center">
          <DescriptionIcon sx={{ mr: 1 }} />
          <JobDescriptionField
            value={jobDescription}
            onChange={setJobDescription}
            onBlur={() => handleBlur('jobDescription', jobDescription)}
          />
        </Box>
        {errors.jobDescription && <Typography color="error">{errors.jobDescription}</Typography>}
        <Box display="flex" alignItems="center">
          <ChecklistIcon sx={{ mr: 1 }} />
          <RequirementsField
            requirements={requirements}
            onAdd={addRequirement}
            onRemove={removeRequirement}
            onChange={handleRequirementChange}
            onBlur={handleRequirementBlur}
            error={errors.requirements}
          />
        </Box>
        {errors.requirements && <Typography color="error">{errors.requirements}</Typography>}
        <Box display="flex" alignItems="center">
          <FmdGoodIcon sx={{ mr: 1 }} />
          <LocationField
            value={location}
            onChange={setLocation}
            onBlur={() => handleBlur('location', location)}
          />
        </Box>
        {errors.location && <Typography color="error">{errors.location}</Typography>}
        <Box display="flex" alignItems="center">
          <CurrencyPoundIcon sx={{ mr: 1 }} />
          <CompensationAmountField
            value={compensationAmount}
            onChange={setCompensationAmount}
            onBlur={() => handleBlur('compensationAmount', compensationAmount)}
          />
        </Box>
        {errors.compensationAmount && <Typography color="error">{errors.compensationAmount}</Typography>}
        <Box display="flex" alignItems="center">
          <AccessTimeIcon sx={{ mr: 1 }} />
          <CompensationTypeField
            value={compensationType}
            onChange={setCompensationType}
            onBlur={() => handleBlur('compensationType', compensationType)}
          />
        </Box>
        {errors.compensationType && <Typography color="error">{errors.compensationType}</Typography>}
        <Box display="flex" alignItems="center">
          <WorkIcon sx={{ mr: 1 }} />
          <JobTypeField
            value={jobType}
            onChange={setJobType}
            onBlur={() => handleBlur('jobType', jobType)}
          />
        </Box>
        {errors.jobType && <Typography color="error">{errors.jobType}</Typography>}
        <Box display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1 }} />
          <EmploymentTermField
            value={employmentTerm}
            onChange={setEmploymentTerm}
            onBlur={() => handleBlur('employmentTerm', employmentTerm)}
          />
        </Box>
        {errors.employmentTerm && <Typography color="error">{errors.employmentTerm}</Typography>}
        <Box display="flex" alignItems="center">
          <InfoIcon sx={{ mr: 1 }} />
          <ISLField value={ISL} onChange={setISL} />
        </Box>
        <Box display="flex" alignItems="center">
          <BuildIcon sx={{ mr: 1 }} />
          <SkillsField
            value={skills}
            onChange={(event, value) => setSkills(value)}
            availableSkills={availableSkills}
            onBlur={() => handleBlur('skills', skills)}
            error={errors.skills}
          />
        </Box>
        {errors.skills && <Typography color="error">{errors.skills}</Typography>}
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddJobPostings;