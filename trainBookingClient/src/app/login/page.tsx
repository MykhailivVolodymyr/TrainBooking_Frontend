'use client'
import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Container, Link, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/userService';
import { UserLogin } from '@/types/user';
import { UserContext } from '@/components/UserContext'; // Шлях до вашого UserContext

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setLoggedIn, setFullName, setRole } = useContext(UserContext); // Отримуємо функції для оновлення контексту

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const userData: UserLogin = {
      email: email,
      password: password,
    };

    try {
      const responseData = await loginUser(userData);
      console.log('Успішний вхід:', responseData);
      setLoggedIn(true); // Оновлюємо стан логіну в контексті
      setFullName(responseData.fullName); // Зберігаємо повне ім'я в контексті
      setRole(responseData.role);
      router.back(); // Перенаправляємо на попередню сторінку
    } catch (err: any) {
      console.error('Помилка входу:', err.message);
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Вхід
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Електронна пошта"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Увійти
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Не маєте облікового запису? Зареєструватися"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;