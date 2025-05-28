'use client'
import React from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Modal } from '@mui/material';
import { TicketResult } from '@/types/ticket';
import { getTickets } from '@/services/ticketService';
import { returnTicket, downloadTicketPdf } from '@/services/ticketService'; // Імпортуємо downloadTicketPdf
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';

const MyTicketsPage = () => {
    const [tickets, setTickets] = useState<TicketResult[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [ticketIdToReturn, setTicketIdToReturn] = useState<string | null>(null);

    const fetchTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (err: any) {
            setError(err.message || 'Сталася помилка при завантаженні квитків.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            setError('Будь ласка, увійдіть в систему, щоб переглянути свої квитки.');
            setLoading(false);
            return;
        }
        fetchTickets();
    }, []);

    const handleOpenReturnModal = (id: string) => {
        setTicketIdToReturn(id);
        setIsReturnModalOpen(true);
    };

    const handleCloseReturnModal = () => {
        setIsReturnModalOpen(false);
        setTicketIdToReturn(null);
    };

    const handleConfirmReturn = async () => {
        if (ticketIdToReturn) {
            try {
                await returnTicket(ticketIdToReturn);
                console.log(`Квиток з ID ${ticketIdToReturn} успішно повернуто.`);
                fetchTickets(); // Викликаємо функцію для оновлення списку квитків
            } catch (error) {
                console.error('Помилка при поверненні квитка:', error);
                setError('Сталася помилка при поверненні квитка.'); // Можна оновити стан помилки для відображення користувачеві
            } finally {
                handleCloseReturnModal();
            }
        }
    };

    const handleDownloadTicket = (ticketId: number) => {
        downloadTicketPdf(ticketId);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={80} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!tickets || tickets.length === 0) {
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>Мої квитки</Typography>
                <Paper sx={{ padding: 2 }}>
                    <Typography>У вас немає придбаних квитків.</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Мої квитки</Typography>
            <List sx={{ width: '100%' }}>
                {tickets.map((ticket) => {
                    const departureDate = parseISO(ticket.departureTime);
                    const isPast = departureDate < new Date();

                    return (
                        <Paper
                            key={ticket.ticketId}
                            elevation={3}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                padding: 2,
                            }}
                        >
                            <ListItem alignItems="center">
                                <ListItemText
                                    primary={`${ticket.departureCity} - ${ticket.arrivalCity}`}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Поїзд №{ticket.trainNumber}, Вагон №{ticket.carriageNumber}, Місце №{ticket.seatNumber}
                                            </Typography>
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Відправлення: {format(departureDate, 'yyyy-MM-dd HH:mm')}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                                <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="outlined" color="info" size="small" onClick={() => handleDownloadTicket(ticket.ticketId)}>
                                        Завантажити
                                    </Button>
                                    {!isPast && (
                                        <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenReturnModal(ticket.ticketId)}>
                                            Повернути
                                        </Button>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Paper>
                    );
                })}
            </List>
            <Modal
                open={isReturnModalOpen}
                onClose={handleCloseReturnModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Підтвердження повернення
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Ви впевнені, що хочете повернути цей квиток?
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleCloseReturnModal}>Ні</Button>
                        <Button variant="contained" color="secondary" onClick={handleConfirmReturn}>Так</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default MyTicketsPage;