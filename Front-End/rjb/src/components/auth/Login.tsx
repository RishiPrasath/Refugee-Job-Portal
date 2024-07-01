import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import EmailField from '../fields/EmailField';
import PasswordField from '../fields/PasswordField';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log({ email, password });
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
      </Box>
    </Box>
  );
};

export default Login;
