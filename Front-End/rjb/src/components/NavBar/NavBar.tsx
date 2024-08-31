import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery, Popover, Badge,} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GroupIcon from '@mui/icons-material/Group';
import { useTheme } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useGlobalState } from '../../globalState/globalState';
import NotificationList from '../Notifications/NotificationList';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';

type Notification = {
  id: number;
  description: string;
  recipient: number;
  owner: number;
  routetopage: string;
  created_at: string;
  notification_image: string;
};

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loggedIn, userType, setLoggedIn, profile_picture, company_logo, userID, username, email } = useGlobalState() as {
    loggedIn: boolean;
    userType: string;
    setLoggedIn: (loggedIn: boolean) => void;
    profile_picture: string;
    company_logo: string;
    userID: string;
    username: string;
    email: string;
  };
  const navigate = useNavigate();
  const ws = useRef<WebSocket | null>(null);
  const eventWs = useRef<WebSocket | null>(null); // Add ref for event WebSocket

  useEffect(() => {
    const connectWebSocket = () => {
      if (ws.current) {
        ws.current.close();
      }

      ws.current = new WebSocket(`ws://localhost:8000/ws/notifications/${userID}/`);

      ws.current.onopen = () => {
        console.log(`Connected to notification group: notifications_${userID}`);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const message = data.message; // Unwrap the message field

        if (message === 'Connection established successfully') {
          return;
        }

        console.log('Received WebSocket message:', message);

        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            id: prevNotifications.length + 1,
            ...message,
          },
        ]);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...');
        setTimeout(connectWebSocket, 120000); // Reconnect after 2 minutes
      };
    };

    if (userID) {
      connectWebSocket();
    }

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userID]);

  useEffect(() => {
    if (userType === 'Hiring Coordinator') {
      const connectEventWebSocket = () => {
        if (eventWs.current) {
          eventWs.current.close();
        }

        eventWs.current = new WebSocket(`ws://localhost:8000/ws/events/`);

        eventWs.current.onopen = () => {
          console.log('Event WebSocket connection established');
        };

        eventWs.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const message = data.message; // Unwrap the message field

          console.log("Event Message:", message);

          if (message === 'Connection established successfully') {
            return;
          }

          console.log('Received Event WebSocket message:', message);
        };

        eventWs.current.onerror = (error) => {
          console.error('Event WebSocket error:', error);
        };

        eventWs.current.onclose = () => {
          console.log('Event WebSocket connection closed, attempting to reconnect...');
          setTimeout(connectEventWebSocket, 120000); // Reconnect after 2 minutes
        };
      };

      connectEventWebSocket();

      // Cleanup Event WebSocket connection on component unmount
      return () => {
        if (eventWs.current) {
          eventWs.current.close();
        }
      };
    }
  }, [userType]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8000/notifications/getnotifications/?username=${username}&email=${email}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Notifications: ", data);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [username, email]);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/');
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleDismissNotification = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/notifications/dismiss/${id}/`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to dismiss notification');
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const renderNavItems = (
    <List style={{ display: isMobile ? 'block' : 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {loggedIn && (
        <>
          <ListItem button component={Link} to="/home" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
            <HomeIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/chat-menu" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
            <ChatIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
            <ListItemText primary="Chats" />
          </ListItem>
          {userType === 'Employer' && (
            <>
              <ListItem button component={Link} to="/employer-profile" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <AccountCircleIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button component={Link} to="/viewjobpostings" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <WorkIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="View Job Postings" />
              </ListItem>
              <ListItem button component={Link} to="/upcoming-interviews" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <CalendarTodayIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Upcoming Interviews" />
              </ListItem>
            </>
          )}
          {userType === 'Case Worker' && (
            <>
              <ListItem button component={Link} to="/viewcandidates" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <GroupIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Your Candidates" />
              </ListItem>
              <ListItem button component={Link} to="/create-candidate" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <GroupIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Create Candidate" />
              </ListItem>
            </>
          )}
          {userType === 'Candidate' && (
            <>
              <ListItem button component={Link} to="/profile" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <AccountCircleIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button component={Link} to="/searchjobpostings" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <WorkIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Search Job Postings" />
              </ListItem>
              <ListItem button component={Link} to="/candidate-upcoming-interviews" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <CalendarTodayIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Upcoming Interviews" />
              </ListItem>
              <ListItem button component={Link} to="/candidate-job-offers" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <WorkOutlineIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Job Offers" />
              </ListItem>
              <ListItem button component={Link} to="/job-applications" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <WorkOutlineIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Job Applications" />
              </ListItem>
            </>
          )}
          {userType === 'Hiring Coordinator' && (
            <ListItem button component={Link} to="/hiring-coordinator-search" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <SearchIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
              <ListItemText primary="Search" />
            </ListItem>
          )}
          <ListItem button onClick={handleLogout} style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
            <PowerSettingsNewIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
            <ListItemText primary="Log Out" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap style={{ flexGrow: 1, textAlign: 'center' }}>
                Refugee Job Board
              </Typography>
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
            </>
          ) : (
            <>
              <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                Refugee Job Board
              </Typography>
              <Box display="flex" flexDirection="row">
                {renderNavItems}
              </Box>
              <Box flexGrow={1} />
            </>
          )}
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotificationList notifications={notifications} onClose={handleNotificationClose} onDismiss={handleDismissNotification} />
          </Popover>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;