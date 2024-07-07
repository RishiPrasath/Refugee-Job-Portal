import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useTheme } from '@mui/material/styles';
import { useGlobalState } from '../../globalState/globalState';

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loggedIn, setLoggedIn } = useGlobalState();
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
        <ListItem button component={Link} to="/home">
          <ListItemText primary="Home" />
        </ListItem>
      )}
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
          {!loggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/" style={{ fontSize: '0.75rem' }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" style={{ fontSize: '0.75rem' }}>
                Registration
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout} style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>
              Log Out
              <PowerSettingsNewIcon style={{ marginLeft: '0.5rem' }} />
            </Button>
          )}
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
    </>
  );
};

export default NavBar;
