import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, Badge, useMediaQuery, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

// Define interface for notifications
interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  status: string;
  notification_type: string;
  created_at: string;
}

interface Data {
  notifications: Notification[];
}

const data: Data = {
  notifications: [
    {
      notification_id: 1,
      user_id: 1,
      message: 'Your application for Software Developer has been received.',
      status: 'unread',
      notification_type: 'application update',
      created_at: '2024-06-01T10:00:00Z'
    },
    {
      notification_id: 2,
      user_id: 1,
      message: 'You have an interview scheduled for Data Analyst on 2024-06-05.',
      status: 'unread',
      notification_type: 'interview schedule',
      created_at: '2024-06-02T12:00:00Z'
    },
    {
      notification_id: 3,
      user_id: 1,
      message: 'New job posting: Frontend Developer at Tech Solutions.',
      status: 'unread',
      notification_type: 'recommended job',
      created_at: '2024-06-03T09:00:00Z'
    },
    {
      notification_id: 4,
      user_id: 1,
      message: 'Your interview for Data Analyst is in 1 hour.',
      status: 'unread',
      notification_type: 'interview reminder',
      created_at: '2024-06-05T08:00:00Z'
    },
    {
      notification_id: 5,
      user_id: 1,
      message: 'Your application for Data Analyst has been accepted. Congratulations!',
      status: 'unread',
      notification_type: 'job offer',
      created_at: '2024-06-06T15:00:00Z'
    },
    {
      notification_id: 6,
      user_id: 1,
      message: 'New job posting: Backend Developer at DevCorp.',
      status: 'unread',
      notification_type: 'recommended job',
      created_at: '2024-06-07T10:00:00Z'
    },
    {
      notification_id: 7,
      user_id: 1,
      message: 'Your application for Backend Developer at DevCorp has been received.',
      status: 'unread',
      notification_type: 'application update',
      created_at: '2024-06-08T11:00:00Z'
    },
    {
      notification_id: 8,
      user_id: 1,
      message: 'You have an interview scheduled for Backend Developer at DevCorp on 2024-06-12.',
      status: 'unread',
      notification_type: 'interview schedule',
      created_at: '2024-06-09T13:00:00Z'
    },
    {
      notification_id: 9,
      user_id: 1,
      message: 'Your interview for Backend Developer is in 1 hour.',
      status: 'unread',
      notification_type: 'interview reminder',
      created_at: '2024-06-12T08:00:00Z'
    },
    {
      notification_id: 10,
      user_id: 1,
      message: 'Your application for Backend Developer at DevCorp has been rejected.',
      status: 'unread',
      notification_type: 'application update',
      created_at: '2024-06-13T17:00:00Z'
    }
  ]
};

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const { notifications } = data;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleNotificationDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setNotificationDrawerOpen(open);
  };

  const unreadCount = notifications.filter((notification) => notification.status === 'unread').length;

  const renderNavItems = (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/profile-management">
        <ListItemText primary="Profile Management" />
      </ListItem>
      <ListItem button component={Link} to="/job-postings">
        <ListItemText primary="Job Postings" />
      </ListItem>
      <ListItem button component={Link} to="/job-posting-details">
        <ListItemText primary="Job Posting Details" />
      </ListItem>
      <ListItem button component={Link} to="/job-application">
        <ListItemText primary="Job Application" />
      </ListItem>
      <ListItem button component={Link} to="/interview-scheduling">
        <ListItemText primary="Interview Scheduling" />
      </ListItem>
      <ListItem button component={Link} to="/activity-monitoring-dashboard">
        <ListItemText primary="Activity Monitoring" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" style={{ flexGrow: 1, fontSize: '0.875rem' }}>
            Job Portal
          </Typography>
          {!isMobile && (
            <>
              <Button color="inherit" component={Link} to="/" style={{ fontSize: '0.75rem' }}>
                Home
              </Button>
              <Button color="inherit" component={Link} to="/profile-management" style={{ fontSize: '0.75rem' }}>
                Profile Management
              </Button>
              <Button color="inherit" component={Link} to="/job-postings" style={{ fontSize: '0.75rem' }}>
                Job Postings
              </Button>
              <Button color="inherit" component={Link} to="/job-posting-details" style={{ fontSize: '0.75rem' }}>
                Job Posting Details
              </Button>
              <Button color="inherit" component={Link} to="/job-application" style={{ fontSize: '0.75rem' }}>
                Job Application
              </Button>
              <Button color="inherit" component={Link} to="/interview-scheduling" style={{ fontSize: '0.75rem' }}>
                Interview Scheduling
              </Button>
              <Button color="inherit" component={Link} to="/activity-monitoring-dashboard" style={{ fontSize: '0.75rem' }}>
                Activity Monitoring
              </Button>
            </>
          )}
          <IconButton color="inherit" onClick={toggleNotificationDrawer(true)}>
            <Badge badgeContent={unreadCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          p={2}
          width={250}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {renderNavItems}
        </Box>
      </Drawer>
      <Drawer anchor="right" open={notificationDrawerOpen} onClose={toggleNotificationDrawer(false)}>
        <Box p={2} width={300}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <IconButton onClick={toggleNotificationDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {notifications.map((notification) => (
              <ListItem 
                key={notification.notification_id}
                sx={{
                  border: '1px solid #ccc',
                  boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                  marginBottom: '8px'
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.created_at).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
