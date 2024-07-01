import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField, Button, Box, IconButton, Chip, Avatar, Autocomplete, Popper, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import AccessibilityIcon from '@mui/icons-material/AccessibilityNew';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CloseIcon from '@mui/icons-material/Close';

// Define interfaces for the profile data
interface Profile {
  full_name: string;
  date_of_birth: string;
  contact_info: string;
  emergency_contact: string;
  location: string;
  linkedin_profile: string;
  github_profile: string;
  summary: string;
  skills: string[];
  qualifications: string;
  languages: string;
  job_preferences: string;
  accessibility_requirements: string;
  status: string;
  past_work_experiences: WorkExperience[];
}

interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  skills_involved: string[];
}

interface Data {
  profile: Profile;
}

// Sample data
const data: Data = {
  profile: {
    full_name: 'John Doe',
    date_of_birth: '1990-01-01',
    contact_info: 'john.doe@example.com, +44 1234 567890',
    emergency_contact: 'Jane Doe, +44 0987 654321',
    location: 'London',
    linkedin_profile: 'https://www.linkedin.com/in/johndoe',
    github_profile: 'https://github.com/johndoe',
    summary: 'Experienced software developer',
    skills: ['JavaScript', 'React', 'Node.js'],
    qualifications: 'B.Sc. Computer Science',
    languages: 'English, Spanish',
    job_preferences: 'Software development roles',
    accessibility_requirements: 'Remote work',
    status: 'Full Time',
    past_work_experiences: [
      {
        company: 'Tech Corp',
        role: 'Software Developer',
        duration: '2020-01-01 - 2023-01-01',
        skills_involved: ['JavaScript', 'React'],
      },
    ],
  },
};

// List of available skills for the autocomplete dropdown
const availableSkills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'SQL', 'NoSQL', 'HTML', 'CSS',
  'C++', 'C#', 'Java', 'Go', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Rust',
  'Chemical Science', 'Biological Science', 'Archaeology', 'Graphic Design', 'Multimedia Design',
  'Laboratory Technician', 'Pharmaceutical Technician', 'Art', 'Dance', 'Music',
  'Arts Management', 'Agriculture', 'Fishing', 'Welding', 'Boat Building', 'Stonemasonry', 'Bricklaying',
  'Roofing', 'Carpentry', 'Construction', 'Retrofit', 'Care Work', 'Senior Care Work',
  'Animal Care', 'Deckhand', 'Project Management', 'Product Management', 'System Administration',
  'Network Engineering', 'Mobile Development', 'Content Writing', 'SEO', 'Marketing',
  'Sales', 'Customer Support', 'Business Analysis', 'Data Science'
];

const ProfileManagement: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(data.profile);
  const [skillInputValue, setSkillInputValue] = useState('');

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillDelete = (skillToDelete: string) => () => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToDelete),
    });
  };

  const handleSkillAdd = (event: any, newSkill: string | null) => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
    }
    setSkillInputValue('');
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedExperiences = profile.past_work_experiences.map((experience, i) =>
      i === index ? { ...experience, [e.target.name]: e.target.value } : experience
    );
    setProfile({
      ...profile,
      past_work_experiences: updatedExperiences,
    });
  };

  const handleAddExperience = () => {
    setProfile({
      ...profile,
      past_work_experiences: [
        ...profile.past_work_experiences,
        { company: '', role: '', duration: '', skills_involved: [] },
      ],
    });
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = profile.past_work_experiences.filter((_, i) => i !== index);
    setProfile({
      ...profile,
      past_work_experiences: updatedExperiences,
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Profile Management
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <PersonIcon />
                {isEditing ? (
                  <TextField
                    label="Full Name"
                    name="full_name"
                    fullWidth
                    value={profile.full_name}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.full_name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon />
                {isEditing ? (
                  <TextField
                    label="Date of Birth"
                    name="date_of_birth"
                    fullWidth
                    value={profile.date_of_birth}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.date_of_birth}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <EmailIcon />
                {isEditing ? (
                  <TextField
                    label="Contact Info"
                    name="contact_info"
                    fullWidth
                    value={profile.contact_info}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.contact_info}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <PhoneIcon />
                {isEditing ? (
                  <TextField
                    label="Emergency Contact"
                    name="emergency_contact"
                    fullWidth
                    value={profile.emergency_contact}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.emergency_contact}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <LocationOnIcon />
                {isEditing ? (
                  <TextField
                    label="Location"
                    name="location"
                    fullWidth
                    value={profile.location}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.location}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <LinkedInIcon />
                {isEditing ? (
                  <TextField
                    label="LinkedIn Profile"
                    name="linkedin_profile"
                    fullWidth
                    value={profile.linkedin_profile}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    <a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer">
                      {profile.linkedin_profile}
                    </a>
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <GitHubIcon />
                {isEditing ? (
                  <TextField
                    label="GitHub Profile"
                    name="github_profile"
                    fullWidth
                    value={profile.github_profile}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    <a href={profile.github_profile} target="_blank" rel="noopener noreferrer">
                      {profile.github_profile}
                    </a>
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <AssignmentIcon />
                {isEditing ? (
                  <TextField
                    label="Summary"
                    name="summary"
                    fullWidth
                    value={profile.summary}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.summary}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <TimelineIcon />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Skills
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ ml: 5 }}>
                {isEditing ? (
                  <>
                    {profile.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        onDelete={handleSkillDelete(skill)}
                        deleteIcon={<CloseIcon />}
                        sx={{ marginRight: 1, marginBottom: 1 }}
                      />
                    ))}
                    <Autocomplete
                      options={availableSkills}
                      inputValue={skillInputValue}
                      onInputChange={(event, newInputValue) => setSkillInputValue(newInputValue)}
                      onChange={handleSkillAdd}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Add Skill"
                          variant="outlined"
                          sx={{ marginRight: 1, marginBottom: 1, minWidth: '200px' }}
                        />
                      )}
                      PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
                      PaperComponent={(props) => <Paper {...props} style={{ width: 'auto', maxWidth: '300px' }} />}
                    />
                  </>
                ) : (
                  profile.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="primary" sx={{ marginRight: 1, marginBottom: 1 }} />
                  ))
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <SchoolIcon />
                {isEditing ? (
                  <TextField
                    label="Qualifications"
                    name="qualifications"
                    fullWidth
                    value={profile.qualifications}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.qualifications}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <LanguageIcon />
                {isEditing ? (
                  <TextField
                    label="Languages"
                    name="languages"
                    fullWidth
                    value={profile.languages}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.languages}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <WorkIcon />
                {isEditing ? (
                  <TextField
                    label="Job Preferences"
                    name="job_preferences"
                    fullWidth
                    value={profile.job_preferences}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.job_preferences}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <AccessibilityIcon />
                {isEditing ? (
                  <TextField
                    label="Accessibility Requirements"
                    name="accessibility_requirements"
                    fullWidth
                    value={profile.accessibility_requirements}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.accessibility_requirements}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <EventAvailableIcon />
                {isEditing ? (
                  <TextField
                    label="Status"
                    name="status"
                    fullWidth
                    value={profile.status}
                    onChange={handleChange}
                    sx={{ ml: 2 }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {profile.status}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Past Work Experiences
              </Typography>
              {profile.past_work_experiences.map((experience, index) => (
                <Box key={index} mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        <TextField
                          label="Company"
                          name="company"
                          fullWidth
                          value={experience.company}
                          onChange={(e) => handleExperienceChange(index, e)}
                        />
                      ) : (
                        <Typography variant="body1">
                          <strong>Company:</strong> {experience.company}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        <TextField
                          label="Role"
                          name="role"
                          fullWidth
                          value={experience.role}
                          onChange={(e) => handleExperienceChange(index, e)}
                        />
                      ) : (
                        <Typography variant="body1">
                          <strong>Role:</strong> {experience.role}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        <TextField
                          label="Duration"
                          name="duration"
                          fullWidth
                          value={experience.duration}
                          onChange={(e) => handleExperienceChange(index, e)}
                        />
                      ) : (
                        <Typography variant="body1">
                          <strong>Duration:</strong> {experience.duration}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        <TextField
                          label="Skills Involved"
                          name="skills_involved"
                          fullWidth
                          value={Array.isArray(experience.skills_involved) ? experience.skills_involved.join(', ') : ''}
                          onChange={(e) => handleExperienceChange(index, e)}
                        />
                      ) : (
                        <Typography variant="body1">
                          <strong>Skills Involved:</strong> {experience.skills_involved.join(', ')}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => handleDeleteExperience(index)}
                        sx={{ visibility: isEditing ? 'visible' : 'hidden' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              {isEditing && (
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddExperience}
                  >
                    Add Work Experience
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={handleEditClick}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileManagement;
