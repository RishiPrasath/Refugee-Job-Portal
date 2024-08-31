import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import EmailField from '../../components/fields/Registration/EmailField';
import PasswordField from '../../components/fields/Registration/PasswordField';
import { useGlobalState } from '../../globalState/globalState';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const { 
    setLoggedIn, 
    setUsername, 
    setEmail: setGlobalEmail, 
    setUserType, 
    setFullName, 
    setProfilePicture, 
    setCompanyLogo, 
    setSkills, 
    setAccessibilityRequirements, 
    setImmigrationStatus, 
    setCompanyName, 
    setAssignedCaseWorker,
    setUserID, // Added setUserID here
    loggedIn, 
    userType, 
    username, 
    email: globalEmail, 
    profile_picture, 
    company_logo, 
    skills, 
    accessibility_requirements, 
    immigration_status, 
    full_name, 
    company_name 
  } = useGlobalState();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(undefined); // Clear error when user starts typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(undefined); // Clear error when user starts typing
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);

        setLoggedIn(true);
        setUsername(data.username);
        setGlobalEmail(data.email);
        setUserType(data.role);
        setFullName(data.full_name);
        setProfilePicture(data.profile_picture);
        setCompanyLogo(data.company_logo);
        setSkills(data.skills);
        setAccessibilityRequirements(data.accessibility_requirements);
        setImmigrationStatus(data.immigration_status);
        setCompanyName(data.company_name);
        setAssignedCaseWorker(data.assigned_case_worker);
        setUserID(data.id); 

        // Log global state variables
        console.log('Global State after login:', {
          loggedIn,
          userType,
          username,
          globalEmail,
          profile_picture,
          company_logo,
          skills,
          accessibility_requirements,
          immigration_status,
          full_name,
          company_name,
          userID: data.id // Log userID
        });

        navigate('/home');
      } else {
        if (data.message === "User does not exist") {
          setEmailError(data.message);
        } else if (data.message === "Incorrect password") {
          setPasswordError(data.message);
        } else {
          setEmailError(data.message);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setEmailError('An error occurred during login.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box
        component="form"
        sx={{ mt: 1, width: '100%', maxWidth: 360 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <EmailField
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />
        <PasswordField
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        {emailError && (
          <Typography color="error" variant="body2">
            {emailError}
          </Typography>
        )}
        {passwordError && (
          <Typography color="error" variant="body2">
            {passwordError}
          </Typography>
        )}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={handleRegisterRedirect}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;