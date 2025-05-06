'use client';

import { useEffect, useState } from 'react';
import {
  TextField,
  Stack,
  Button,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { getFilteredTransit, getScheduleTransit } from '@/services/scheduleService';
import { ScheduleTransitEntity } from '@/types/schedule';
import TrainScheduleTransit from '@/components/ScheduleTransit';

export default function Home() {
  const [searchCity, setSearchCity] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [scheduleCity, setScheduleCity] = useState('Львів'); // Стан для міста в розкладі
  const [departureData, setDepartureData] = useState<ScheduleTransitEntity[]>([]);
  const [arrivalData, setArrivalData] = useState<ScheduleTransitEntity[]>([]);

  const router = useRouter();

  // Встановлення дати за замовчуванням
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

    const fetchScheduleData = async (city: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Отримуємо сьогоднішню дату у форматі YYYY-MM-DD
      const departure = await getScheduleTransit(city, today, true);
      const arrival = await getScheduleTransit(city, today, false);
      setDepartureData(departure);
      setArrivalData(arrival);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchScheduleData(scheduleCity); // Завантаження даних при першому рендерингу та зміні scheduleCity
  }, [scheduleCity]);

  const handleSearch = () => {
    if (!searchCity || !destination || !date) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    const query = new URLSearchParams({
      from: searchCity,
      to: destination,
      date: date,
    }).toString();

    router.push(`/Schedule?${query}`);
  };

  const handleScheduleCityChange = (newCity: string) => {
    setScheduleCity(newCity);
  };

  const filteredDepartures = getFilteredTransit(departureData);
  const filteredArrivals = getFilteredTransit(arrivalData);

  return (
    <>
      <Box
        sx={{
          minHeight: '80vh',
          background: 'linear-gradient(to right,rgb(177, 209, 252),rgb(80, 156, 249))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          pt: 10,
          pb: 4,
          px: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: 'white',
            width: '100%',
            maxWidth: 1200,
            minHeight: 'auto',
            mb: 4,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, fontWeight: 500, color: 'primary.main' }}
          >
            В один бік
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
            Пошук квитків
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              label="Звідки"
              variant="outlined"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f5f5f5', width: '100%' }}
            />
            <TextField
              label="Куди"
              variant="outlined"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f5f5f5', width: '100%' }}
            />
            <TextField
              label="Дата поїздки"
              type="date"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f5f5f5', width: '100%' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                height: '48px',
                px: 6,
                minWidth: '150px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Знайти
            </Button>
          </Stack>
        </Paper>
      </Box>
      {/* Компонент TrainScheduleTransit тепер повністю за межами основного Box */}
      <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', mt: 4 }}>
        <TrainScheduleTransit
          departureTrains={filteredDepartures}
          arrivalTrains={filteredArrivals}
          city={scheduleCity}
          onCityChange={handleScheduleCityChange}
        />
      </Box>
    </>
  );
}