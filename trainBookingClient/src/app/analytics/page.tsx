'use client'
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableHead, TableRow, Paper, Grid, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrainIcon from '@mui/icons-material/Train';
import { getRevenueReport, getRoutePopularityReport, downloadReportCsv } from '@/services/reportsService'; // Імпортуємо функцію для завантаження звіту
import { RevenueReport, RoutePopularityReport } from '@/types/reports';

// Стилізовані компоненти
const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
        color: theme.palette.primary.main,
        opacity: 1,
    },
    '&.Mui-selected': {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
        backgroundColor: theme.palette.action.focus,
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
}));

const StyledTable = styled(Table)(({ theme }) => ({
    '& thead th': {
        fontWeight: '600',
        backgroundColor: '#f0f4c3',
        color: '#1a1a1a',
    },
    '& tbody td': {
        borderBottom: '1px solid #e0e0e0',
    },
    '& tbody tr:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const ReportsPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [routePopularityData, setRoutePopularityData] = useState<RoutePopularityReport[] | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueReport[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-12-31');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        setError(null);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (selectedTab === 0) {
                const data = await getRoutePopularityReport(startDate, endDate);
                setRoutePopularityData(data);
                setRevenueData(null);
            } else {
                const data = await getRevenueReport(startDate, endDate);
                setRevenueData(data);
                setRoutePopularityData(null);
            }
        } catch (err: any) {
            setError('Немає даних для цього діапазону дат');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTab, startDate, endDate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const renderTable = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress size={60} />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error">{error}</Alert>
            );
        }

        if (selectedTab === 0 && routePopularityData) {
            if (routePopularityData.length === 0) {
                return <Typography>No route popularity data available for the selected period.</Typography>;
            }
            return (
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер потяга</TableCell>
                            <TableCell>Напрямок</TableCell>
                            <TableCell>Кількість поїздок</TableCell>
                            <TableCell>Кількість проданих квитків</TableCell>
                            <TableCell>Середня завантаженість (%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {routePopularityData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.number}</TableCell>
                                <TableCell>{item.direction}</TableCell>
                                <TableCell>{item.numberOfTrips}</TableCell>
                                <TableCell>{item.numberOfTicketsSold}</TableCell>
                                <TableCell>{item.averageOccupancyPercentage}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            );
        }

        if (selectedTab === 1 && revenueData) {
            if (revenueData.length === 0) {
                return <Typography>No revenue data available for the selected period.</Typography>
            }
            return (
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата покупки квитка</TableCell>
                            <TableCell>Кількість проданих квитків</TableCell>
                            <TableCell>Загальний дохід</TableCell>
                            <TableCell>Найпопулярніший потяг</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {revenueData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{formatDate(item.date)}</TableCell>
                                <TableCell>{item.ticketsSold}</TableCell>
                                <TableCell>{item.revenue}</TableCell>
                                <TableCell>{item.mostPopularTrain}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            );
        }

        return null;
    };

    const handleDownloadReport = () => {
        if (selectedTab === 0) {
            downloadReportCsv('routespopulariry', startDate, endDate);
        } else {
            downloadReportCsv('revenuereport', startDate, endDate);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <StyledTabs
                orientation="vertical"
                variant="scrollable"
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="report tabs"
                sx={{ width: 250 }}
            >
                <StyledTab icon={<TrainIcon />} label="Звіт по популярності маршрутів" />
                <StyledTab icon={<TrendingUpIcon />} label="Звіт по доходам" />
            </StyledTabs>
            <Box sx={{ flex: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>Звіти</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography>Start Date:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <Typography>End Date:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <Button onClick={fetchData} variant="contained" color="primary">
                            Оновити звіт
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleDownloadReport} variant="contained" color="success">
                            Завантажити звіт
                        </Button>
                    </Grid>
                </Grid>

                <StyledPaper>
                    {renderTable()}
                </StyledPaper>
            </Box>
        </Box>
    );
};

export default ReportsPage;

