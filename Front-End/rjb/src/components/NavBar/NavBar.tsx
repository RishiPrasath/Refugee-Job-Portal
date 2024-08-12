import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery, Popover, Badge, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from '@mui/material/styles';
import { useGlobalState } from '../../globalState/globalState';
import NotificationList, { notificationCount } from '../Notifications/NotificationList';

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loggedIn, userType, setLoggedIn, profile_picture, company_logo } = useGlobalState() as {
    loggedIn: boolean;
    userType: string;
    setLoggedIn: (loggedIn: boolean) => void;
    profile_picture: string;
    company_logo: string;
  };
  const navigate = useNavigate();

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

  const renderNavItems = (
    <>
      {isMobile && (
        <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Avatar 
            src={userType === 'Candidate' ? `data:image/png;base64,${profile_picture}` : `data:image/png;base64,${company_logo}`} 
            alt="Profile or Company Logo" 
            style={{ width: '150px', height: '150px' }} 
          />
        </Box>
      )}
      <List style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', padding: 0 }}>
        {!loggedIn ? (
          <>
            <ListItem button component={Link} to="/" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <ListItemText primary="Registration" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/home" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <HomeIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/employer-profile" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <AccountCircleIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
              <ListItemText primary="Profile" />
            </ListItem>
            {userType === 'Employer' && (
              <>
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
              <ListItem button component={Link} to="/viewcandidates" style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
                <GroupIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
                <ListItemText primary="Your Candidates" />
              </ListItem>
            )}
            {userType === 'Candidate' && (
              <>
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
            <ListItem button onClick={handleLogout} style={{ fontSize: isMobile ? '1.5rem' : '0.64rem', padding: isMobile ? '0 2rem' : '0 1rem', marginBottom: isMobile ? '1rem' : '0' }}>
              <PowerSettingsNewIcon style={{ marginRight: isMobile ? '0.6rem' : '0.3rem', fontSize: isMobile ? '1.8rem' : '0.8rem' }} />
              <ListItemText primary="Log Out" />
            </ListItem>
          </>
        )}
      </List>
    </>
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
              {renderNavItems}
              <Box flexGrow={1} />
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={notificationCount} color="secondary">
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
                <NotificationList />
              </Popover>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;