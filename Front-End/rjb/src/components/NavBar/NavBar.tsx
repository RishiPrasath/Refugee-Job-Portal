import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'; // Import icon
import { useTheme } from '@mui/material/styles';
import { useGlobalState } from '../../globalState/globalState';

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const { loggedIn, userType, setLoggedIn, profile_picture, company_logo } = useGlobalState();
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

  const getButtonStyle = () => ({
    fontSize: '0.8rem',
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'none' as 'none',
  });

  const renderNavItems = (
    <List>
      {!loggedIn ? (
        <>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/register">
            <ListItemText primary="Registration" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component={Link} to="/home">
            <HomeIcon style={{ marginRight: '0.5rem' }} />
            <ListItemText primary="Home" />
          </ListItem>
          {userType === 'Employer' && (
            <>
              <ListItem button component={Link} to="/viewjobpostings">
                <WorkIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="View Job Postings" />
              </ListItem>
              <ListItem button component={Link} to="/upcoming-interviews">
                <CalendarTodayIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="Upcoming Interviews" />
              </ListItem>
            </>
          )}
          {userType === 'Case Worker' && (
            <ListItem button component={Link} to="/viewcandidates">
              <WorkIcon style={{ marginRight: '0.5rem' }} />
              <ListItemText primary="Candidates" />
            </ListItem>
          )}
          {userType === 'Candidate' && (
            <>
              <ListItem button component={Link} to="/searchjobpostings">
                <WorkIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="Search Job Postings" />
              </ListItem>
              <ListItem button component={Link} to="/candidate-upcoming-interviews">
                <CalendarTodayIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="Upcoming Interviews" />
              </ListItem>
              <ListItem button component={Link} to="/candidate-job-offers">
                <WorkOutlineIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="Job Offers" />
              </ListItem>
              <ListItem button component={Link} to="/profile">
                <AccountCircleIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button component={Link} to="/job-applications">
                <WorkOutlineIcon style={{ marginRight: '0.5rem' }} />
                <ListItemText primary="Job Applications" />
              </ListItem>
            </>
          )}
          <ListItem button onClick={handleLogout}>
            <PowerSettingsNewIcon style={{ marginRight: '0.5rem' }} />
            <ListItemText primary="Log Out" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                  p={2}
                  width={250}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  {loggedIn && (
                    <Box display="flex" justifyContent="center" mb={2}>
                      {userType === 'Employer' && company_logo && (
                        <Avatar
                          src={`data:image/jpeg;base64,${company_logo}`}
                          alt="Company Logo"
                          style={{ width: '80px', height: '80px' }}
                        />
                      )}
                      {userType === 'Candidate' && profile_picture && (
                        <Avatar
                          src={`data:image/jpeg;base64,${profile_picture}`}
                          alt="Profile Picture"
                          style={{ width: '80px', height: '80px' }}
                        />
                      )}
                    </Box>
                  )}
                  {renderNavItems}
                </Box>
              </Drawer>
            </>
          ) : (
            <>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Refugee Job Portal
              </Typography>
              {!loggedIn ? (
                <>
                  <Button color="inherit" component={Link} to="/" style={getButtonStyle()}>
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register" style={getButtonStyle()}>
                    Registration
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/home" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                    <HomeIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                    Home
                  </Button>
                  {userType === 'Employer' && (
                    <>
                      <Button color="inherit" component={Link} to="/viewjobpostings" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <WorkIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        View Job Postings
                      </Button>
                      <Button color="inherit" component={Link} to="/upcoming-interviews" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <CalendarTodayIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        Upcoming Interviews
                      </Button>
                    </>
                  )}
                  {userType === 'Case Worker' && (
                    <Button color="inherit" component={Link} to="/viewcandidates" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                      <WorkIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                      Candidates
                    </Button>
                  )}
                  {userType === 'Candidate' && (
                    <>
                      <Button color="inherit" component={Link} to="/searchjobpostings" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <WorkIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        Search Job Postings
                      </Button>
                      <Button color="inherit" component={Link} to="/candidate-upcoming-interviews" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <CalendarTodayIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        Upcoming Interviews
                      </Button>
                      <Button color="inherit" component={Link} to="/candidate-job-offers" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <WorkOutlineIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        Job Offers
                      </Button>
                      <Button color="inherit" component={Link} to="/profile" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <AccountCircleIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        Profile
                      </Button>
                      <Button color="inherit" component={Link} to="/job-applications" style={{ ...getButtonStyle(), fontSize: '0.8rem' }}>
                        <WorkOutlineIcon style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                        Job Applications
                      </Button>
                    </>
                  )}
                  <Button color="inherit" onClick={handleLogout} style={{ ...getButtonStyle(), fontSize: '0.8rem', marginLeft: 'auto' }}>
                    Log Out
                    <PowerSettingsNewIcon style={{ marginLeft: '0.4rem', fontSize: '0.8rem' }} />
                  </Button>
                  {userType === 'Employer' && company_logo && (
                    <Avatar
                      src={`data:image/jpeg;base64,${company_logo}`}
                      alt="Company Logo"
                      style={{ marginLeft: '1rem', width: '40px', height: '40px' }}
                    />
                  )}
                  {userType === 'Candidate' && profile_picture && (
                    <Avatar
                      src={`data:image/jpeg;base64,${profile_picture}`}
                      alt="Profile Picture"
                      style={{ marginLeft: '1rem', width: '40px', height: '40px' }}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;