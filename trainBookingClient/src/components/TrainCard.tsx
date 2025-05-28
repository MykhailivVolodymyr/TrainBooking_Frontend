'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Divider, Modal, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { blue } from '@mui/material/colors';
import TrainIcon from '@mui/icons-material/Train';
import { ScheduleEntity } from '@/types/schedule';
import { useRouter } from 'next/navigation';
import { getRouteDetails } from '@/services/routeService';
import { RouteDetailsEntity } from '@/types/routeDetails';
import CloseIcon from '@mui/icons-material/Close';
import { getAvailableSeats} from '@/services/seatService'; // Імпортуємо сервіс для отримання місць
import { TrainStructure } from '@/types/trainStructure';
import { calculateTravelTime, formatDate, calculateCarriagePrice, modalStyle, timelineDot, timelineEmptyDot, timelineLine, stationInfo } from '@/services/helperTrainCard';

interface TicketCardProps {
  schedule: ScheduleEntity;
}


function TrainCard({ schedule }: TicketCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeDetails, setRouteDetails] = useState<RouteDetailsEntity[] | null>(null);
  const [loadingRouteDetails, setLoadingRouteDetails] = useState(false);
  const [routeDetailsError, setRouteDetailsError] = useState<string | null>(null);
  const [availableSeats, setAvailableSeats] = useState<TrainStructure | null>(null);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [seatsError, setSeatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      setLoadingSeats(true);
      setSeatsError(null);
      try {
        const data = await getAvailableSeats(schedule.scheduleId);
        setAvailableSeats(data);
      } catch (error) {
        console.error('Помилка отримання доступних місць:', error);
        setSeatsError('Не вдалося завантажити інформацію про доступні місця.');
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchAvailableSeats();
  }, [schedule.scheduleId]);

  const handleCardClick = () => {
    // Prepare prices object to pass as state
    const carriagePrices = availableSeats?.carriages.reduce((acc, carriage) => {
      const price = calculateCarriagePrice(schedule, carriage.carriageType);
      if (price !== null) {
        acc[carriage.carriageType] = price;
      }
      return acc;
    }, {} as Record<string, number>);

    const pricesString = JSON.stringify(carriagePrices);
    // Формуємо об'єкт trip
    const tripObject = {
        trip: {
            trainId: schedule.trainId,
            departureTime: `${schedule.realDepartureDateFromCity}T${schedule.arrivalTimeFromCity}`, // додати Z
            arrivalTime: `${schedule.realDepartureDateToCity}T${schedule.arrivalTimeToCity}`,
            startStationName: schedule.fromStationName,
            endStationName: schedule.toStationName,
            sheduleId: schedule.scheduleId,
          },
      };
  
      const tripString = JSON.stringify(tripObject);

      router.push(`/train/${schedule.scheduleId}?scheduleId=${schedule.scheduleId}&prices=${encodeURIComponent(pricesString)}&trip=${encodeURIComponent(tripString)}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRouteDetails(null);
    setRouteDetailsError(null);
  };

  const handleRouteDetailsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setLoadingRouteDetails(true);
    setRouteDetailsError(null);
    getRouteDetails(schedule.trainNumber)
      .then((data) => {
        setRouteDetails(data);
        handleOpenModal();
      })
      .catch((error) => {
        console.error('Помилка отримання деталей маршруту:', error);
        setRouteDetailsError('Не вдалося завантажити деталі маршруту.');
      })
      .finally(() => {
        setLoadingRouteDetails(false);
      });
  };


  const travelTime = calculateTravelTime(
    schedule.realDepartureDateFromCity,
    schedule.arrivalTimeFromCity,
    schedule.realDepartureDateToCity,
    schedule.arrivalTimeToCity
  );

  const carriageTypes = availableSeats?.carriages.reduce((acc, carriage) => {
    const existingType = acc.find(item => item.type === carriage.carriageType);
    if (existingType) {
      existingType.capacity += carriage.capacity;
    } else {
      acc.push({ type: carriage.carriageType, capacity: carriage.capacity });
    }
    return acc;
  }, [] as { type: string; capacity: number }[]);

  return (
    <>
      <Card sx={{ minWidth: 360, maxWidth: '90%', mt: 3, mx: 'auto', cursor: 'pointer' }} onClick={handleCardClick}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.9rem',
                backgroundColor: blue[700],
                color: 'white',
                borderRadius: '4px',
                padding: '2px 4px',
              }}
            >
              {schedule.trainNumber}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(0, 0, 0, 0.12)', borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Box sx={{ textAlign: 'center', mr: 4, pl: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {schedule.arrivalTimeFromCity.slice(0, 5)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                  {formatDate(schedule.realDepartureDateFromCity)}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {schedule.fromStationName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 0.5 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
                    {travelTime}
                  </Typography>
                </Box>
                <ArrowForwardIcon sx={{ my: 0.5 }} />
              </Box>

              <Box sx={{ textAlign: 'center', pr: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {schedule.arrivalTimeToCity.slice(0, 5)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                  {formatDate(schedule.realDepartureDateToCity)}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {schedule.toStationName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {loadingSeats ? (
                <Typography variant="caption">Завантаження місць...</Typography>
              ) : seatsError ? (
                <Typography variant="caption" color="error">{seatsError}</Typography>
              ) : carriageTypes && carriageTypes.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}> {/* Додано ці стилі */}
                  {carriageTypes.map((carriageInfo) => (
                    <Box key={carriageInfo.type} onClick={(e) => e.stopPropagation()}>
                      <Button sx={{ all: 'unset', cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid rgba(0, 0, 0, 0.12)', pl: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            {carriageInfo.type}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
                            {carriageInfo.capacity} місць
                          </Typography>
                          <Typography variant="h6" sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                            {calculateCarriagePrice(schedule, carriageInfo.type) !== null ? `${calculateCarriagePrice(schedule, carriageInfo.type)} ₴` : '—'}
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="caption">Немає інформації про місця</Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrainIcon sx={{ fontSize: '1rem', color: 'rgba(0, 0, 0, 0.6)', mr: 1 }} />
            <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(0, 0, 0, 0.6)', mr: 3 }}>
              {schedule.routeCities}
            </Typography>
            <Button
              size="small"
              sx={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.9rem', textTransform: 'none', ml: 2 }}
              onClick={handleRouteDetailsClick}
            >
              Деталі маршруту
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="route-details-modal-title"
        aria-describedby="route-details-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="route-details-modal-title" variant="h6" component="h2">
              Маршрут {schedule.trainNumber}
            </Typography>
            <IconButton aria-label="close" onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {loadingRouteDetails && <Typography>Завантаження...</Typography>}
          {routeDetailsError && <Typography color="error">{routeDetailsError}</Typography>}
          {routeDetails && routeDetails.length > 0 ? (
            <Box sx={{ position: 'relative', maxHeight: '60vh', overflowY: 'auto' }}>
              {routeDetails.map((station, index) => {
                const isDeparture = station.stationName === schedule.fromStationName;
                const isArrival = station.stationName === schedule.toStationName;
                const isFilled = isDeparture || isArrival;

                return (
                  <Box key={station.stationOrder} sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                    <Box sx={isFilled ? timelineDot : timelineEmptyDot} />
                    {index > 0 && !(isFilled || (index < routeDetails.length - 1 && (routeDetails[index + 1].stationName === schedule.fromStationName || routeDetails[index + 1].stationName === schedule.toStationName))) && (
                      <Box sx={{ ...timelineLine, top: 8 + 24 * (index - 1), bottom: 8 + 24 * (routeDetails.length - 2 - index + 1), left: 4 }} />
                    )}
                    <Box sx={stationInfo}>
                      <Typography variant="subtitle2">{station.arrivalTime?.slice(0, 5) || '—'}{station.departureTime && station.arrivalTime !== station.departureTime ? ` - ${station.departureTime?.slice(0, 5)}` : ''}</Typography>
                      <Typography>{station.stationName}</Typography>
                      <Typography variant="caption">
                        {isDeparture ? 'відправлення' : (isArrival ? 'прибуття' : '')}
                        {station.arrivalTime && station.departureTime && station.arrivalTime !== station.departureTime && ` (зупинка ${Math.floor(new Date(`2000-01-01T${station.departureTime}`).getTime() - new Date(`2000-01-01T${station.arrivalTime}`).getTime()) / (1000 * 60)} хв)`}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            routeDetailsError ? null : <Typography>Деталі маршруту не знайдено.</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default TrainCard;