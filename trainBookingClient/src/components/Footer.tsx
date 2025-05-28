import React from 'react';
import { Box, Typography, Link, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#3f51b5', // Темно-синій колір
        color: 'white', // Білий колір тексту для кращої контрастності
        py: 2, // Зменшено вертикальний padding зверху та знизу
        pb: 3, // Зменшено padding знизу
        mt: 3,
      }}
    >
      {/* Вміст футера залишається без змін */}
      <Grid container justifyContent="space-around" spacing={2}>
        <Grid item xs={12} sm={6} md={4} textAlign={{ xs: 'center', sm: 'left' }}>
          <Typography variant="h6" color="inherit" gutterBottom>
            Залізничні квитки
          </Typography>
          <Typography variant="body2" color="inherit">
            Ваш зручний сервіс для онлайн купівлі залізничних квитків.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3} textAlign={{ xs: 'center', sm: 'left' }}>
          <Typography variant="h6" color="inherit" gutterBottom>
            Корисні посилання
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
            <Link href="/terms" color="inherit" underline="hover" sx={{ mb: 1 }}>
              Умови використання
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Контакти
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} textAlign="center">
          <Typography variant="h6" color="inherit" gutterBottom>
            Слідкуйте за нами
          </Typography>
          <Box>
            <IconButton color="inherit" aria-label="facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="twitter">
              <TwitterIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="body2" color="inherit" align="center" sx={{ mt: 2 }}>
        © {new Date().getFullYear()} Залізничні квитки.
      </Typography>
    </Box>
  );
};

export default Footer;