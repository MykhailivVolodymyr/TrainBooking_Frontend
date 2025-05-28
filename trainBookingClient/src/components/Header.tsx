import React, { useState, useContext, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/components/UserContext';
import { logoutUser } from '@/services/userService';
import DashboardIcon from '@mui/icons-material/Dashboard'; // For Analytics
import EditCalendarIcon from '@mui/icons-material/EditCalendar'; // For Schedule Management

interface HeaderProps {
  userProfileUrl?: string;
}

const Header = ({ userProfileUrl }: HeaderProps) => {
  const router = useRouter();
  const { isLoggedIn, fullName, role, setLoggedIn, setFullName, setRole } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleTabloClick = () => {
    router.push('/#train-schedule-board');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleProfileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [setAnchorEl]);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

    const handleMyTicketsClick = useCallback(() => {
        handleMenuClose();
        router.push('/mytickets');
    }, [handleMenuClose, router]);

  const handleAnalyticsClick = useCallback(() => {
    handleMenuClose();
    router.push('/analytics'); // Замініть '/analytics' на шлях до вашої сторінки з аналітикою
  }, [handleMenuClose, router]);

  const handleScheduleEditClick = useCallback(() => {
    handleMenuClose();
    router.push('/changeSchedule'); // Замініть '/schedule' на шлях до вашої сторінки редагування розкладу
  }, [handleMenuClose, router]);

  const handleLogoutClick = useCallback(async () => {
    handleMenuClose();
    try {
      await logoutUser();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('fullName');
      localStorage.removeItem('role');
      setLoggedIn(false);
      setFullName(null);
      setRole(null);
    } catch (error: any) {
      console.error('Помилка виходу:', error.message);
    }
  }, [handleMenuClose, router, setLoggedIn, setFullName, setRole]);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMyTicketsClick}>
        <ListItemIcon>
          <ConfirmationNumberIcon />
        </ListItemIcon>
        <ListItemText primary="Мої квитки" />
      </MenuItem>
      {role === 'Admin' && (
        <>
          <MenuItem onClick={handleAnalyticsClick}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Аналітика" />
          </MenuItem>
          <MenuItem onClick={handleScheduleEditClick}>
            <ListItemIcon>
              <EditCalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Зміна розкладу" />
          </MenuItem>
        </>
      )}
      <MenuItem onClick={handleLogoutClick}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText primary="Вийти" />
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#3f51b5',
        color: 'white',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
        {/* Ліва частина */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            onClick={handleLogoClick}
            sx={{ mr: 1 }}
          >
            <TrainIcon />
          </IconButton>
          <Button color="inherit" sx={{ ml: 0 }} onClick={handleTabloClick}>
            Табло
          </Button>
          <Button color="inherit" sx={{ ml: 1 }}>
            Допомога
          </Button>
        </Box>

        {/* Права частина */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isLoggedIn ? (
            <Button color="inherit" onClick={handleLoginClick}>
              Увійти
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ '& svg': { fontSize: 40 } }}
              >
                {userProfileUrl ? (
                  <Avatar src={userProfileUrl} sx={{ width: 40, height: 40 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              {fullName && (
                <Typography variant="subtitle1" color="inherit" sx={{ ml: 1 }}>
                  {fullName}
                </Typography>
              )}
              {role === 'Admin' && (
                <Typography variant="subtitle2" color="inherit" sx={{ ml: 1 }}>
                  (Admin)
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
};

export default Header;

