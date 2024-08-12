import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

type Props = {
  title: string;
  message: string;
  date: string;
};

const NotificationCard: React.FC<Props> = ({ title, message, date }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{message}</Typography>
        <Typography variant="caption" color="textSecondary">{date}</Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;