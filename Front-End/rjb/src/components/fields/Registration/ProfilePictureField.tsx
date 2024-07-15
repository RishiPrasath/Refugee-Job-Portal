import React from 'react';
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material';

interface ProfilePictureFieldProps {
  value: File | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ProfilePictureField: React.FC<ProfilePictureFieldProps> = ({ onChange, error }) => (
  <FormControl fullWidth margin="normal" error={!!error}>
    <InputLabel shrink htmlFor="profile-picture">Profile Picture</InputLabel>
    <Input
      id="profile-picture"
      type="file"
      onChange={onChange}
      inputProps={{ accept: 'image/*' }}
    />
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

export default ProfilePictureField;
