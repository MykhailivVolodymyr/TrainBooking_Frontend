'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { TrainStructure } from '@/types/trainStructure'; // Шлях до вашого типу
import { Typography, Box, CircularProgress } from '@mui/material';
import { getAvailableSeats } from '@/services/seatService';

export default function TrainDetailsPage() {
  const { scheduleId } = useParams(); // Отримуємо scheduleId з параметрів
  const [trainStructure, setTrainStructure] = useState<TrainStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (scheduleId) {
          // Передаємо scheduleId у функцію getAvailableSeats
          const data = await getAvailableSeats(parseInt(scheduleId as string, 10));
          setTrainStructure(data);
        }
      } catch (err: any) {
        console.error('Помилка при отриманні структури потяга:', err);
        setError('Не вдалося завантажити структуру потяга.');
        setTrainStructure(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [scheduleId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!trainStructure) {
    return <Typography>Інформація про потяг не знайдена.</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Структура потяга {trainStructure.trainNumber} ({trainStructure.trainType || 'Н/Д'})
      </Typography>
      {trainStructure.carriages.map((carriage, index) => (
        <Box key={carriage.carriageId} sx={{ border: '1px solid #ccc', borderRadius: 1, padding: 2, mb: 2 }}>
          <Typography variant="h6">Вагон {index + 1}: {carriage.carriageType} (Місць: {carriage.capacity})</Typography>
          {carriage.seats.length > 0 ? (
            <ul>
              {carriage.seats.map((seat) => (
                <li key={seat.seatId}>Місце №{seat.seatNumber} ({seat.seatType})</li>
              ))}
            </ul>
          ) : (
            <Typography>У цьому вагоні немає місць.</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}