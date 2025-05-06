'use client'
import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { blue } from '@mui/material/colors';
import TrainIcon from '@mui/icons-material/Train'; // Імпортуємо іконку потяга

const TicketCard = () => {
  const handleSeatClick = () => {
    console.log('Клікнуто на блок з місцями');
  };

  return (
    <Card sx={{ minWidth: 360, maxWidth: '90%', mt: 3, mx: 'auto' }}>
      <CardContent>
        {/* Верхня частина з номером поїзда */}
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
            029К
          </Typography>
        </Box>

        {/* Основна інформація про маршрут та ціна */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          {/* Ліва частина з інформацією про маршрут */}
          <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(0, 0, 0, 0.12)', borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
            {/* Блок відправлення */}
            <Box sx={{ textAlign: 'center', mr: 4, pl: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                19:26
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                6 травня
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> Київ-Пас
              </Typography>
            </Box>

            {/* Блок "в дорозі" */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 0.5 }} />
                <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
                  6 год 34 хв
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ my: 0.5 }} />
            </Box>

            {/* Блок прибуття */}
            <Box sx={{ textAlign: 'center', pr: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                02:00
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                7 травня
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> Львів
              </Typography>
            </Box>
          </Box>

          {/* Права частина з типом вагона та ціною - обгорнуто в Button */}
          <Button onClick={handleSeatClick} sx={{ all: 'unset', cursor: 'pointer' }}>
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

        <Divider sx={{ mb: 1 }} />

        {/* Контейнер для назви рейсу та кнопки - додано іконку потяга */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrainIcon sx={{ fontSize: '1rem', color: 'rgba(0, 0, 0, 0.6)', mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(0, 0, 0, 0.6)', mr: 3 }}>
            Харків-Чернівці
          </Typography>
          <Button size="small" sx={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.9rem', textTransform: 'none', ml: 2 }}>
            Деталі маршруту
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;