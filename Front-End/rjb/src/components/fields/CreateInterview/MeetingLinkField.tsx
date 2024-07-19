import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';

interface MeetingLinkFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const MeetingLinkField: React.FC<MeetingLinkFieldProps> = ({ value, onChange }) => {
  const [error, setError] = useState<string | null>(null);

  // URL validation regex from Gist
  // Source: https://gist.github.com/parkerrobison/d151c4c26f6c37f62fe180028c95346c
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  const validate = (newValue: string) => {
    if (!newValue) {
      setError('Meeting link is required');
      console.log("Meeting link is required");
    } else if (!urlPattern.test(newValue)) {
      setError('Invalid URL');
      console.log("Invalid URL");
    } else {
      setError(null);
      console.log("Valid URL");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    validate(newValue);
    onChange(newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    validate(newValue);
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Meeting Link"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!error}
        helperText={error}
      />
    </div>
  );
};

export default MeetingLinkField;