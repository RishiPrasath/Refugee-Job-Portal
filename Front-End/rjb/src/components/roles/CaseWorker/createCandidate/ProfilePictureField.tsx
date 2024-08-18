import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ProfilePictureFieldProps {
  value: File | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ProfilePictureField: React.FC<ProfilePictureFieldProps> = ({ value, onChange, error }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      onChange(e);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="body1" sx={{ mr: 2 }}>
        Profile Picture
      </Typography>
      <Button
        variant="contained"
        component="label"
      >
        Choose File
        <input
          type="file"
          name="profile_picture"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {fileName && (
        <Typography variant="body2" sx={{ ml: 2 }}>
          {fileName}
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="body2" sx={{ ml: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ProfilePictureField;