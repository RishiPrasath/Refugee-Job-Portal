import React, { useState, useEffect } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface CustomTextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({ value, onChange }) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== value) {
        const event = new Event('input', { bubbles: true }) as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        event.target = { value: text } as HTMLTextAreaElement;
        onChange(event);
      }
    }, 300); // Debounce time 300ms

    return () => {
      clearTimeout(timer);
    };
  }, [text, value, onChange]);

  return (
    <TextareaAutosize
      style={{ width: '100%' }}
      minRows={4}
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default CustomTextarea;