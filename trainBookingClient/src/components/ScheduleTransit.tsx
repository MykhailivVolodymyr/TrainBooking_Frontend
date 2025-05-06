import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ScheduleTransitEntity } from '@/types/schedule';

interface TrainScheduleProps {
  departureTrains: ScheduleTransitEntity[];
  arrivalTrains: ScheduleTransitEntity[];
  city: string;
  onCityChange: (newCity: string) => void; // Додаємо пропс для обробки зміни міста
}

function TrainScheduleTransit({ departureTrains, arrivalTrains, city, onCityChange }: TrainScheduleProps) {
  const [localCity, setLocalCity] = useState(city);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCity(event.target.value);
  };

  const handleCityChange = () => {
    onCityChange(localCity);
  };

  return (
    <Box
      sx={{
        bgcolor: '#1e272e',
        color: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Місто"
            variant="outlined"
            size="small"
            value={localCity}
            onChange={handleCityInputChange}
            sx={{ mr: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.7)' },
            }}
          />
          <Button size="small" sx={{ color: '#54a0ff' }} onClick={handleCityChange}>
            Змінити
          </Button>
        </Box>
        <Typography variant="h6">{currentTime}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ArrowBackIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Відправлення
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 1 }} />
          <List disablePadding>
            {departureTrains.map((train, index) => (
              <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                <ListItemText
                  primary={`${train.trainNumber} ${train.routeCities}`}
                  secondary={`Час: ${train.time}, Станція: ${train.stationName}`}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: 'grey' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ArrowForwardIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Прибуття
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 1 }} />
          <List disablePadding>
            {arrivalTrains.map((train, index) => (
              <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                <ListItemText
                  primary={`${train.trainNumber} ${train.routeCities}`}
                  secondary={`Час: ${train.time}, Станція: ${train.stationName}`}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: 'grey' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          Більше рейсів <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Box>
  );
}

export default TrainScheduleTransit;