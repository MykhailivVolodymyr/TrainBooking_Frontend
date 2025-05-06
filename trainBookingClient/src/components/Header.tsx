import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation'; // Імпортуємо useRouter

interface HeaderProps {
  onLoginClick?: () => void;
  userProfileUrl?: string; // URL зображення профілю користувача
  isLoggedIn?: boolean;
}

const Header = ({ onLoginClick, userProfileUrl, isLoggedIn }: HeaderProps) => {
  const router = useRouter(); // Ініціалізуємо роутер

  const handleLogoClick = () => {
    router.push('/'); // Перехід на головну сторінку ('/')
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#3f51b5', // Темно-синій колір (indigo.500 з палітри Material UI)
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
            onClick={handleLogoClick} // Додаємо обробник кліку
            sx={{ mr: 1 }} // Додаємо відступ справа для кращого вигляду
          >
            <TrainIcon />
          </IconButton>
          <Button color="inherit" sx={{ ml: 0 }}>
            Табло
          </Button>
          <Button color="inherit" sx={{ ml: 1 }}>
            Допомога
          </Button>
        </Box>

        {/* Права частина */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isLoggedIn ? (
            <Button color="inherit" onClick={onLoginClick}>
              Увійти
            </Button>
          ) : (
            <IconButton color="inherit" aria-label="account">
              {userProfileUrl ? (
                <Avatar src={userProfileUrl} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;