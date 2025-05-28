'use client'
import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Container, Link, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/userService';
import { UserRegister } from '@/types/user';
import { UserContext } from '@/components/UserContext'; // Шлях до вашого UserContext

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setLoggedIn, setFullName: setContextFullName } = useContext(UserContext); // Отримуємо функції з контексту

  // Функція валідації email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  // Функція валідації імені (лише літери та пробіли)
    const isValidFullName = (fullName: string) => {
        const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/;
        return nameRegex.test(fullName);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Валідація полів
    if (!fullName.trim()) {
      setError('Будь ласка, введіть повне ім\'я.');
      return;
    }

        if (!isValidFullName(fullName)) {
            setError('Повне ім\'я може містити лише літери та пробіли.');
            return;
        }

    if (!email.trim()) {
      setError('Будь ласка, введіть email.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Введіть коректний email.');
      return;
    }

    if (!password.trim()) {
      setError('Будь ласка, введіть пароль.');
      return;
    }

    if (password.length < 6) {
      setError('Пароль повинен містити не менше 6 символів.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }

    const userData: UserRegister = {
      fullName: fullName,
      email: email,
      password: password,
    };

    try {
      const responseData = await registerUser(userData);
      console.log('Успішна реєстрація:', responseData);
      setSuccessMessage('Реєстрація успішна!');
      setLoggedIn(true);
      setContextFullName(responseData.fullName);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      console.error('Помилка реєстрації:', err.message);
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
          Реєстрація
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Повне ім'я"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Підтвердіть пароль"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Зареєструватися
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="success" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                {"Вже маєте обліковий запис? Увійти"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
