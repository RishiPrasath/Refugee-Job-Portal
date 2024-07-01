import React, { useState } from 'react';
import { FormControl, InputLabel, TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ProfilePictureField: React.FC<Props> = ({ value, onChange, error }) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setLocalError('File size must be less than 5MB');
        return;
      }
      setLocalError(undefined);
      onChange(event);
    }
  };

  return (
    <FormControl fullWidth margin="normal" error={!!localError}>
      <InputLabel shrink htmlFor="profile-picture">
        Profile Picture
      </InputLabel>
      <TextField
        fullWidth
        type="file"
        id="profile-picture"
        name="profilePicture"
        onChange={handleFileChange}
        error={!!localError}
        helperText={localError || ''}
        inputProps={{ accept: 'image/*' }}
        sx={{ mb: 2 }}
      />
    </FormControl>
  );
};

export default ProfilePictureField;
