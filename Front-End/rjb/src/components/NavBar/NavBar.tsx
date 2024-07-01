import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, Badge, useMediaQuery, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
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
    // Notification data if needed
  ]
};

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const renderNavItems = (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem button component={Link} to="/register">
        <ListItemText primary="Registration" />
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
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" style={{ fontSize: '0.75rem' }}>
                Registration
              </Button>
            </>
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
