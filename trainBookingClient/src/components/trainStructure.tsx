'use client';
import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Grid, Modal, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { Carriage, Seat, TrainStructure } from '@/types/trainStructure';
import { useRouter } from 'next/navigation';

interface TripInfo {
  trainId: number;
  departureTime: string;
  arrivalTime: string;
  startStationName: string;
  endStationName: string;
  sheduleId: number;
}

interface SeatProps {
  seat: { seatId: number; seatNumber: number; seatType: string } | null;
  onSeatClick: (seatId: number, seatNumber: number, seatType: string, carriageNumber: number, price: number) => void;
  isSelected: boolean;
  isAvailable: boolean;
}

const SeatItem = (props: SeatProps) => {
  const { seat, onSeatClick, isSelected, isAvailable } = props;
  const handleClick = () => {
    if (seat && isAvailable) {
      onSeatClick(seat.seatId, seat.seatNumber, seat.seatType, 0, 0);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '30px',
        height: '30px',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.8rem',
        backgroundColor: seat
          ? isSelected
            ? 'primary.main'
            : '#e0e0e0'
          : '#bdbdbd',
        color: seat ? (isSelected ? '#fff' : '#333') : '#757575',
        cursor: seat && isAvailable ? 'pointer' : 'default',
      }}
      onClick={handleClick}
    >
      {seat?.seatNumber}
    </Paper>
  );
};

interface CarriageDisplayProps {
  carriage: Carriage;
  onSeatClick: (seatId: number, seatNumber: number, seatType: string, carriageNumber: number, price: number) => void;
  selectedSeats: Set<number>;
  carriageNumber: number;
  prices: Record<string, number>;
}

const CarriageDisplay = (props: CarriageDisplayProps) => {
  const { carriage, onSeatClick, selectedSeats, carriageNumber, prices } = props;
  const allSeats = Array.from({ length: carriage.capacity }, (_, i) => i + 1);
  const availableSeatsInCarriage = carriage.seats.length;
  const carriagePrice = prices[carriage.carriageType] || 0;

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: 2,
        marginBottom: 2,
        width: '70%',
        ml: 0,
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Вагон №{carriageNumber} ({carriage.carriageType}, вільних місць: {availableSeatsInCarriage}, ціна: {carriagePrice} грн)
      </Typography>
      <Grid container spacing={1}>
        {allSeats.map((seatNumber) => {
          const availableSeat = carriage.seats.find((s) => s.seatNumber === seatNumber);
          const seatData = availableSeat ? availableSeat : null;
          const isAvailable = !!availableSeat;
          const seatId = seatData?.seatId;

          return (
            <Grid item key={seatNumber}>
              <SeatItem
                seat={seatData ? { ...seatData, seatNumber, seatType: seatData.seatType } : null}
                onSeatClick={(id, num, type) => {
                  if (seatData) {
                    onSeatClick(id, num, type, carriageNumber, carriagePrice);
                  }
                }}
                isSelected={seatId ? selectedSeats.has(seatId) : false}
                isAvailable={isAvailable}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

interface TrainStructureDisplayProps {
  scheduleId: number;
  prices: Record<string, number>;
  tripInfo: TripInfo | null;
}

const TrainStructureDisplay: React.FC<TrainStructureDisplayProps> = ({ scheduleId, prices, tripInfo }) => {
  const [trainData, setTrainData] = useState<TrainStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<number>>(new Set());
  const [selectedSeatsInfo, setSelectedSeatsInfo] = useState<
    {
      seatId: number;
      seatNumber: number;
      seatType: string;
      carriageNumber: number;
      price: number;
    }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNoSeatsWarning, setShowNoSeatsWarning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://localhost:7160/api/Train/${scheduleId}/AvalibleSeats`;
        const response = await axios.get<TrainStructure>(url);
        setTrainData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          console.error('Помилка отримання даних про потяг:', err.response.status, err.response.data);
          setError(`Не вдалося завантажити дані про потяг. Статус: ${err.response.status}`);
        } else {
          console.error('Невідома помилка при отриманні даних про потяг:', err);
          setError('Невідома помилка при завантаженні даних.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchAvailableSeats();
    }
  }, [scheduleId]);

  const handleSeatClick = (seatId: number, seatNumber: number, seatType: string, carriageNumber: number, price: number) => {
    const isAlreadySelected = selectedSeatsInfo.some((seat) => seat.seatId === seatId);

    if (selectedSeatsInfo.length < 4 || isAlreadySelected) {
      const newSelectedSeats = new Set(selectedSeats);
      const newSelectedSeatsInfo = [...selectedSeatsInfo];

      if (isAlreadySelected) {
        newSelectedSeats.delete(seatId);
        const indexToRemove = newSelectedSeatsInfo.findIndex((seat) => seat.seatId === seatId);
        if (indexToRemove > -1) {
          newSelectedSeatsInfo.splice(indexToRemove, 1);
        }
      } else {
        newSelectedSeats.add(seatId);
        newSelectedSeatsInfo.push({ seatId, seatNumber, seatType, carriageNumber, price });
      }
      setSelectedSeats(newSelectedSeats);
      setSelectedSeatsInfo(newSelectedSeatsInfo);
      console.log('Вибрані місця:', newSelectedSeatsInfo);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGoToTickets = () => {
    if (selectedSeatsInfo.length === 0) {
      setShowNoSeatsWarning(true);
    } else {
      const queryParams = selectedSeatsInfo.map(seat => `seatId=${seat.seatId}&seatNumber=${seat.seatNumber}&seatType=${seat.seatType}&carriageNumber=${seat.carriageNumber}&price=${seat.price}`).join('&');
      const tripParams = tripInfo ? `&trainId=${tripInfo.trainId}&departureTime=${tripInfo.departureTime}&arrivalTime=${tripInfo.arrivalTime}&startStationName=${tripInfo.startStationName}&endStationName=${tripInfo.endStationName}&sheduleId=${tripInfo.sheduleId}` : '';
      router.push(`/ticketsOffer?${queryParams}${tripParams}`);
    }
  };

  const handleCloseWarning = () => {
    setShowNoSeatsWarning(false);
  };

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

  if (!trainData) {
    return <Typography>Інформація про структуру потяга відсутня.</Typography>;
  }

  return (
    <Box sx={{ py: 2, pl: '2cm' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', mr: 2 }}>
          Потяг №{trainData.trainNumber} ({trainData.trainType || 'Н/Д'})
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoToTickets}>
          Перейти до квитків
        </Button>
      </Box>
      {trainData.carriages.map((carriage, index) => (
        <CarriageDisplay
          key={carriage.carriageId}
          carriage={carriage}
          onSeatClick={handleSeatClick}
          selectedSeats={selectedSeats}
          carriageNumber={index + 1}
          prices={prices}
        />
      ))}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="max-seats-modal-title"
        aria-describedby="max-seats-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="max-seats-modal-title" variant="h6" component="h2">
            Обмеження кількості квитків
          </Typography>
          <Typography id="max-seats-modal-description" sx={{ mt: 2 }}>
            Ви можете вибрати не більше 4 квитків в одному замовленні.
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={showNoSeatsWarning}
        onClose={handleCloseWarning}
        aria-labelledby="no-seats-warning-title"
        aria-describedby="no-seats-warning-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="no-seats-warning-title" variant="h6" component="h2">
            Попередження
          </Typography>
          <Typography id="no-seats-warning-description" sx={{ mt: 2 }}>
            Ви ще не обрали жодного місця. Будь ласка, виберіть місця перед тим, як перейти до оформлення квитків.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseWarning} color="primary">
              Зрозуміло
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TrainStructureDisplay;