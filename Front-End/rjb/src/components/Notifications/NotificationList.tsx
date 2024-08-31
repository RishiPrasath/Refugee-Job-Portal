import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationCard from './NotificationCard';

type Notification = {
  id: number;
  description: string;
  created_at: string;
  notification_image: string | null;
  routetopage: string;
};

type Props = {
  notifications: Notification[];
  onClose: () => void;
  onDismiss: (id: number) => void;
};

const NotificationList: React.FC<Props> = ({ notifications, onClose, onDismiss }) => {
  return (
    <Box sx={{ maxWidth: 400, maxHeight: 400, overflowY: 'auto', p: 2 }}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Box key={notification.id} sx={{ mb: 2 }}>
            <NotificationCard
              id={notification.id}
              description={notification.description}
              created_at={notification.created_at}
              notification_image={notification.notification_image}
              routetopage={notification.routetopage}
              onClose={onClose}
              onDismiss={onDismiss}
            />
          </Box>
        ))
      ) : (
        <Typography>No new notifications</Typography>
      )}
    </Box>
  );
};

export default NotificationList;