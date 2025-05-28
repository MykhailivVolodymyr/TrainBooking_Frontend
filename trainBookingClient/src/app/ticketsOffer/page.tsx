'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Modal } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Trip } from '@/types/ticket';
import { purchaseTickets } from '@/services/ticketService'; // Corrected import path

interface TicketInfo {
    seatId: string;
    seatNumber: string;
    seatType: string;
    carriageNumber: string;
    price: string;
}

interface TripInfo {
    trainId: string;
    departureTime: string;
    arrivalTime: string;
    startStationName: string;
    endStationName: string;
    sheduleId: string;
}


const TicketsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [tickets, setTickets] = useState<TicketInfo[]>([]);
    const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const extractedTickets: TicketInfo[] = [];
        const seatIds = params.getAll('seatId');
        const seatNumbers = params.getAll('seatNumber');
        const seatTypes = params.getAll('seatType');
        const carriageNumbers = params.getAll('carriageNumber');
        const prices = params.getAll('price');

        const numberOfTickets = Math.max(
            seatIds.length,
            seatNumbers.length,
            seatTypes.length,
            carriageNumbers.length,
            prices.length
        );

        for (let i = 0; i < numberOfTickets; i++) {
            extractedTickets.push({
                seatId: seatIds[i] || '',
                seatNumber: seatNumbers[i] || '',
                seatType: seatTypes[i] || '',
                carriageNumber: carriageNumbers[i] || '',
                price: prices[i] || '',
            });
        }

        setTickets(extractedTickets.filter(ticket => ticket.seatId !== ''));

        const trainId = params.get('trainId');
        const departureTime = params.get('departureTime');
        const arrivalTime = params.get('arrivalTime');
        const startStationName = params.get('startStationName');
        const endStationName = params.get('endStationName');
        const sheduleId = params.get('sheduleId');

        if (trainId && departureTime && arrivalTime && startStationName && endStationName && sheduleId) {
            setTripInfo({
                trainId,
                departureTime,
                arrivalTime,
                startStationName,
                endStationName,
                sheduleId,
            });
        }
    }, [searchParams]);

    const handleGoBack = () => {
        router.back();
    };

    const handleCheckout = async () => {
        if (tripInfo) {
            // Check if the user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                setOrderError('Будь ласка, увійдіть в систему, щоб продовжити.');
                return; // Stop the checkout process
            }

            try {
                // Prepare data
                const purchaseTicketsData = tickets.map(ticket => ({
                    seatId: parseInt(ticket.seatId, 10),
                    price: parseFloat(ticket.price)
                }));

                const tripData: Trip = {
                    trainId: parseInt(tripInfo.trainId, 10),
                    departureTime: tripInfo.departureTime,
                    arrivalTime: tripInfo.arrivalTime,
                    startStationName: tripInfo.startStationName,
                    endStationName: tripInfo.endStationName,
                    sheduleId: parseInt(tripInfo.sheduleId, 10)
                };

                // Call purchaseTickets
                await purchaseTickets(purchaseTicketsData, tripData);

                // Show success message and open modal
                setOrderSuccess(true);

            } catch (error: any) {
                console.error('Помилка при оформленні замовлення:', error);
                if (error.response?.status === 401) {
                    setOrderError('Будь ласка, увійдіть в систему, щоб продовжити.');
                } else {
                    setOrderError(error.message || 'Сталася помилка під час оформлення замовлення.');
                }

            }
        }
    };

    const handleCloseModal = () => {
        setOrderSuccess(false);
        router.push('/'); // Navigate to home page
    };
    const handleCloseErrorModal = () => {
        setOrderError(null);
    };


    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Ваші вибрані квитки:
            </Typography>

            {tripInfo && (
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6" gutterBottom>
                        Інформація про поїздку:
                    </Typography>
                    <Typography>
                        Потяг №: <Typography component="span" fontWeight="bold">{tripInfo.trainId}</Typography>
                    </Typography>
                    <Typography>
                        Відправлення: <Typography component="span" fontWeight="bold">{new Date(tripInfo.departureTime).toLocaleString()}</Typography> з <Typography component="span" fontWeight="bold">{tripInfo.startStationName}</Typography>
                    </Typography>
                    <Typography>
                        Прибуття: <Typography component="span" fontWeight="bold">{new Date(tripInfo.arrivalTime).toLocaleString()}</Typography> до <Typography component="span" fontWeight="bold">{tripInfo.endStationName}</Typography>
                    </Typography>
                </Paper>
            )}

            {tickets.length > 0 ? (
                tickets.map((ticket, index) => (
                    <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2, borderLeft: `4px solid primary.main` }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Квиток №{index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography>Місце №:</Typography>
                                <Typography fontWeight="bold">{ticket.seatNumber}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Тип місця:</Typography>
                                <Typography>{ticket.seatType}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Вагон №:</Typography>
                                <Typography>{ticket.carriageNumber}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Ціна:</Typography>
                                <Typography fontWeight="bold">{ticket.price} грн</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            ) : (
                <Typography>
                    Ви не обрали жодного квитка.
                </Typography>
            )}
            <Box sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={handleGoBack} sx={{ mr: 2 }}>
                    Назад до вибору місць
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCheckout}>
                    Оформити замовлення
                </Button>
            </Box>

            {/* Модальне вікно для повідомлення про успішне замовлення */}
            <Modal
                open={orderSuccess}
                onClose={handleCloseModal}
                aria-labelledby="order-success-modal-title"
                aria-describedby="order-success-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography id="order-success-modal-title" variant="h6" component="h2">
                        Замовлення успішне!
                    </Typography>
                    <Typography id="order-success-modal-description" sx={{ mt: 2 }}>
                        Шукайте квитки на електронній пошті, а також у розділі "Мої квитки".
                    </Typography>
                    <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
                        Добре
                    </Button>
                </Box>
            </Modal>
             {/* Modal for error message */}
            <Modal
                open={!!orderError}
                onClose={handleCloseErrorModal}
                aria-labelledby="error-modal-title"
                aria-describedby="error-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #d32f2f', // Error border color
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="error-modal-title" variant="h6" component="h2" color="error">
                        Помилка
                    </Typography>
                    <Typography id="error-modal-description" sx={{ mt: 2 }}>
                        {orderError}
                    </Typography>
                    <Button onClick={handleCloseErrorModal} color="primary" sx={{ mt: 2 }}>
                        Ок
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default TicketsPage;

