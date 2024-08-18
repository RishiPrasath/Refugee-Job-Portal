import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
  description: string;
  created_at: string;
  notification_image: string; // This will now be a URL
  routetopage: string;
  onClose: () => void; // Add onClose prop
};

const NotificationCard: React.FC<Props> = ({ description, created_at, notification_image, routetopage, onClose }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(routetopage);
    onClose(); // Trigger onClose callback
  };

  return (
    <Card onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar src={notification_image} alt="Notification" sx={{ marginRight: 2 }} /> {/* URL image */}
          <Box>
            <Typography variant="body1">{description}</Typography>
            <Typography variant="caption" color="textSecondary">{new Date(created_at).toLocaleString()}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;