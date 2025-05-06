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
import { getRouteDetails } from '@/services/routeService'; // Імпортуємо функцію getRouteDetails
import { RouteDetailsEntity } from '@/types/routeDetails'; // Імпортуємо тип RouteDetailsEntity
import CloseIcon from '@mui/icons-material/Close';

interface TicketCardProps {
  schedule: ScheduleEntity;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  borderRadius: 8,
  p: 3,
  overflowY: 'auto',
};

const timelineDot = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: blue[500],
};

const timelineEmptyDot = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: `2px solid ${blue[500]}`,
  backgroundColor: 'transparent',
};

const timelineLine = {
  width: 2,
  backgroundColor: blue[200],
  position: 'absolute' as 'absolute',
  zIndex: -1,
};

const stationInfo = {
  marginLeft: 16,
};

function TrainCard({ schedule }: TicketCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeDetails, setRouteDetails] = useState<RouteDetailsEntity[] | null>(null);
  const [loadingRouteDetails, setLoadingRouteDetails] = useState(false);
  const [routeDetailsError, setRouteDetailsError] = useState<string | null>(null);

  const handleCardClick = () => {
    router.push(`/train/${schedule.scheduleId}`);
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

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    return `${formattedDay}.${formattedMonth}`;
  };

  const calculateTravelTime = (departureDate: string, departureTime: string, arrivalDate: string, arrivalTime: string): string => {
    const [depYear, depMonth, depDay] = departureDate.split('-');
    const [depHours, depMinutes] = departureTime.split(':');
    const departureDateTime = new Date(
      parseInt(depYear, 10),
      parseInt(depMonth, 10) - 1,
      parseInt(depDay, 10),
      parseInt(depHours, 10),
      parseInt(depMinutes, 10)
    );

    const [arrYear, arrMonth, arrDay] = arrivalDate.split('-');
    const [arrHours, arrMinutes] = arrivalTime.split(':');
    const arrivalDateTime = new Date(
      parseInt(arrYear, 10),
      parseInt(arrMonth, 10) - 1,
      parseInt(arrDay, 10),
      parseInt(arrHours, 10),
      parseInt(arrMinutes, 10)
    );

    const timeDifferenceMs = arrivalDateTime.getTime() - departureDateTime.getTime();
    const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} год ${minutes} хв`;
  };

  const travelTime = calculateTravelTime(
    schedule.realDepartureDateFromCity,
    schedule.arrivalTimeFromCity,
    schedule.realDepartureDateToCity,
    schedule.arrivalTimeToCity
  );

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

            <Box onClick={(e) => e.stopPropagation()}>
              <Button sx={{ all: 'unset', cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid rgba(0, 0, 0, 0.12)', pl: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Купе
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
                    44 місць
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                    659 ₴
                  </Typography>
                </Box>
              </Button>
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
                    {index > 0 && <Box sx={{ ...timelineLine, top: 8 + 24 * (index - 1), bottom: 8 + 24 * (routeDetails.length - 2 - index + 1), left: 4 }} />}
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