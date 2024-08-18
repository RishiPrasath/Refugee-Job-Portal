import React from 'react';
import { Box } from '@mui/material';
import NotificationCard from './NotificationCard';

type Notification = {
  id: number;
  description: string;
  recipient: number;
  owner: number;
  routetopage: string;
  created_at: string;
  notification_image: string; // This will now be a URL
};

type NotificationListProps = {
  notifications: Notification[];
  onClose: () => void;
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onClose }) => {
  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          description={notification.description}
          created_at={notification.created_at}
          notification_image={notification.notification_image} // Pass URL image
          routetopage={notification.routetopage}
          onClose={onClose} // Pass onClose callback
        />
      ))}
    </Box>
  );
};

export default NotificationList;