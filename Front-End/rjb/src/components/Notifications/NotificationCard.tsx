import React, { useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  id: number;
  description: string;
  created_at: string;
  notification_image: string | null;
  routetopage: string;
  onClose: () => void;
  onDismiss: (id: number) => void;
};

const NotificationCard: React.FC<Props> = ({ id, description, created_at, notification_image, routetopage, onClose, onDismiss }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleCardClick = () => {
    navigate(routetopage);
    onClose();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <Card onClick={handleCardClick} sx={{ cursor: 'pointer', position: 'relative' }}>
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{ position: 'absolute', top: 5, right: 5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <CardContent>
              <Box display="flex" alignItems="center">
                {notification_image ? (
                  <Avatar src={notification_image} alt="Notification" sx={{ marginRight: 2 }} />
                ) : (
                  <Avatar sx={{ marginRight: 2, bgcolor: 'primary.main' }}>
                    <MessageIcon />
                  </Avatar>
                )}
                <Box>
                  <Typography variant="body1">{description}</Typography>
                  <Typography variant="caption" color="textSecondary">{new Date(created_at).toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCard;