// TrainDetailsPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import TrainStructureDisplay from "@/components/trainStructure";
import { TrainStructure } from '@/types/trainStructure';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import { getAvailableSeats } from '@/services/seatService';

interface TripInfo {
  trainId: number;
  departureTime: string;
  arrivalTime: string;
  startStationName: string;
  endStationName: string;
  sheduleId: number;
}

export default function TrainDetailsPage() {
  const { scheduleId } = useParams();
  const searchParams = useSearchParams();
  const [trainStructure, setTrainStructure] = useState<TrainStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carriagePrices, setCarriagePrices] = useState<Record<string, number>>({});
  const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (scheduleId) {
          const data = await getAvailableSeats(parseInt(scheduleId as string, 10));
          setTrainStructure(data);

          const pricesString = searchParams.get('prices');
          if (pricesString) {
            try {
              const parsedPrices = JSON.parse(decodeURIComponent(pricesString)) as Record<string, number>;
              setCarriagePrices(parsedPrices);
            } catch (parseError) {
              console.error('Помилка парсингу цін:', parseError);
            }
          }

          const tripString = searchParams.get('trip');
          if (tripString) {
            try {
              const parsedTrip = JSON.parse(decodeURIComponent(tripString)) as { trip: TripInfo };
              setTripInfo(parsedTrip.trip);
            } catch (parseError) {
              console.error('Помилка парсингу інформації про поїздку:', parseError);
            }
          }
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
  }, [scheduleId, searchParams]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!trainStructure) {
    return <Typography>Інформація про потяг не знайдена.</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      {tripInfo && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Поїздка:
          </Typography>
          <Typography variant="subtitle1">
            {tripInfo.startStationName} <Typography component="span" color="primary">→</Typography> {tripInfo.endStationName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Відправлення: {new Date(tripInfo.departureTime).toLocaleString()}
          </Typography>
        </Paper>
      )}

        <Box id="train-schedule-board">
        {scheduleId && (
            <TrainStructureDisplay
            scheduleId={parseInt(scheduleId as string, 10)}
            prices={carriagePrices}
            tripInfo={tripInfo} // Передаємо tripInfo як пропс
            />
        )}
        </Box>
    </Box>
  );
}