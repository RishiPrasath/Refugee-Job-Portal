import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField, TextFieldProps } from '@mui/material';

interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ value, onChange }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (newValue: Date | null) => {
    if (!newValue) {
      setError('Date is required');
    } else if (newValue < new Date()) {
      setError('Date cannot be in the past');
    } else {
      setError(null);
    }
    onChange(newValue);
  };

  return (
    <DatePicker
      label="Date"
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

export default DatePickerField;