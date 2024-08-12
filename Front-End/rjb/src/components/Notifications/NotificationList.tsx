import React from 'react';
import { Box } from '@mui/material';
import NotificationCard from './NotificationCard';

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
};

const dummyNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Job Posting',
    message: 'A new job posting has been added to your preferred category.',
    date: '2023-10-01',
  },
  {
    id: 2,
    title: 'Interview Scheduled',
    message: 'Your interview for the Software Engineer position has been scheduled.',
    date: '2023-10-02',
  },
  {
    id: 3,
    title: 'Profile Update',
    message: 'Your profile has been successfully updated.',
    date: '2023-10-03',
  },
];

const NotificationList: React.FC = () => {
  return (
    <Box>
      {dummyNotifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          title={notification.title}
          message={notification.message}
          date={notification.date}
        />
      ))}
    </Box>
  );
};

export const notificationCount = dummyNotifications.length;

export default NotificationList;