import React from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import { TextField, TextFieldProps } from '@mui/material';

interface TimePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (time: Date | null) => void;
}

const TimePickerField: React.FC<TimePickerFieldProps> = ({ label, value, onChange }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (newValue: Date | null) => {
    if (!newValue) {
      setError('Time is required');
    } else {
      setError(null);
    }
    onChange(newValue);
  };

  return (
    <TimePicker
      label={label}
      value={value}
      onChange={handleChange}
      slotProps={{
        textField: (params: TextFieldProps) => ({
          ...params,
          error: !!error,
          helperText: error,
        }),
      }}
    />
  );
};

export default TimePickerField;