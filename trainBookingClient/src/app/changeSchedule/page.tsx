'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  styled,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { getSchedulePatterns, getTrainSchedulePattern, updateTrainSchedulePattern } from '@/services/schedulePatternService';
import { SchedulePattern } from '@/types/schedulePattern';

// Стилізований компонент TextField для зменшення ширини пошуку
const SearchTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginBottom: theme.spacing(2),
}));

// Стилізована таблиця
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

// Стилізований заголовок таблиці
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

// Стилізований рядок таблиці
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
}));

// Стилізована комірка таблиці
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));

const EditSchedulePage: React.FC = () => {
  const [schedulePatterns, setSchedulePatterns] = useState<SchedulePattern[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchedulePatterns, setFilteredSchedulePatterns] = useState<SchedulePattern[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<SchedulePattern | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<SchedulePattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedulePatterns();
        setSchedulePatterns(data);
        setFilteredSchedulePatterns(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch schedule patterns.');
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm) {
        try {
          setLoading(true);
          const data = await getTrainSchedulePattern(searchTerm);
          setFilteredSchedulePatterns([data]);
          setLoading(false);
          setError(null);
        } catch (err: any) {
          setFilteredSchedulePatterns([]);
          setError(`Потяг з номером "${searchTerm}" не знайдено.`);
          setLoading(false);
        }
      } else {
        setFilteredSchedulePatterns(schedulePatterns);
        setError(null);
      }
    };

    handleSearch();
  }, [searchTerm, schedulePatterns]);

  const handleViewDetails = (schedule: SchedulePattern) => {
    setSelectedSchedule(schedule);
    setEditingSchedule({ ...schedule });
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleCloseDetails = () => {
    setSelectedSchedule(null);
    setEditingSchedule(null);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (editingSchedule) {
      setEditingSchedule({ ...editingSchedule, [name]: value });
    }
  };

  const handleSaveSchedule = async () => {
    if (editingSchedule) {
      setUpdateError(null);
      setUpdateSuccess(false);
      try {
        const updatedSchedule = await updateTrainSchedulePattern(editingSchedule.trainNumber, editingSchedule);
        setSchedulePatterns(prev =>
          prev.map(s => (s.trainNumber === updatedSchedule.trainNumber ? updatedSchedule : s))
        );
        setFilteredSchedulePatterns(prev =>
          prev.map(s => (s.trainNumber === updatedSchedule.trainNumber ? updatedSchedule : s))
        );
        setSelectedSchedule(updatedSchedule);
        setEditingSchedule(updatedSchedule);
        setUpdateSuccess(true);
      } catch (err: any) {
        setUpdateError(err.message || 'Failed to update schedule pattern.');
      }
    }
  };

  const formatDaysOfWeek = (daysOfWeek: string | null): string => {
    if (!daysOfWeek) {
      return '-';
    }
    const days = daysOfWeek.split(',').map(Number);
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    return days.map(day => dayNames[day - 1]).join(', ');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Редагування розкладу руху
      </Typography>

      <SearchTextField
        label="Пошук за номером потяга"
        variant="outlined"
        fullWidth={false}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {loading && <Typography>Завантаження розкладів...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <StyledTableContainer component={Paper}>
          <Table aria-label="schedule table">
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Номер потяга</StyledTableCell>
                <StyledTableCell>Тип періодичності</StyledTableCell>
                <StyledTableCell>Дні тижня</StyledTableCell>
                <StyledTableCell>Парність</StyledTableCell>
                <StyledTableCell align="right">Дії</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredSchedulePatterns.map((schedule) => (
                <StyledTableRow key={schedule.trainId}>
                  <StyledTableCell component="th" scope="row">
                    {schedule.trainNumber}
                  </StyledTableCell>
                  <StyledTableCell>{schedule.frequencyType}</StyledTableCell>
                  <StyledTableCell>{formatDaysOfWeek(schedule.daysOfWeek)}</StyledTableCell>
                  <StyledTableCell>{schedule.dayParity || '-'}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton aria-label="view" onClick={() => handleViewDetails(schedule)}>
                      <VisibilityIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {filteredSchedulePatterns.length === 0 && searchTerm && (
                <TableRow>
                  <StyledTableCell colSpan={5}>Потяг з номером "{searchTerm}" не знайдено.</StyledTableCell>
                </TableRow>
              )}
              {filteredSchedulePatterns.length === 0 && !searchTerm && schedulePatterns.length > 0 && (
                <TableRow>
                  <StyledTableCell colSpan={5}>Немає розкладів для відображення.</StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      {editingSchedule && (
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Редагування розкладу потяга № {editingSchedule.trainNumber}
          </Typography>
          <TextField
            label="Номер потяга"
            name="trainNumber"
            value={editingSchedule.trainNumber}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            disabled
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="frequencyType-label">Тип періодичності</InputLabel>
            <Select
              labelId="frequencyType-label"
              id="frequencyType"
              name="frequencyType"
              value={editingSchedule.frequencyType}
              onChange={handleEditChange}
            >
              <MenuItem value="Щоденно">Щоденно</MenuItem>
              <MenuItem value="Через день">Через день</MenuItem>
              <MenuItem value="Конкретні дні тижня">Конкретні дні тижня</MenuItem>
            </Select>
          </FormControl>

          {editingSchedule.frequencyType === 'Через день' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="dayParity-label">Парність</InputLabel>
              <Select
                labelId="dayParity-label"
                id="dayParity"
                name="dayParity"
                value={editingSchedule.dayParity || ''}
                onChange={handleEditChange}
                defaultValue=""
              >
                <MenuItem value="Парні">Парні</MenuItem>
                <MenuItem value="Непарні">Непарні</MenuItem>
              </Select>
            </FormControl>
          )}

          {editingSchedule.frequencyType === 'Конкретні дні тижня' && (
            <TextField
              label="Дні тижня (1-Пн, 7-Нд, через кому)"
              name="daysOfWeek"
              value={editingSchedule.daysOfWeek || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              placeholder="1,3,5"
            />
          )}

          {updateError && <Typography color="error">{updateError}</Typography>}
          {updateSuccess && <Typography color="success">Розклад оновлено!</Typography>}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseDetails} startIcon={<CloseIcon />} sx={{ mr: 2 }}>
              Скасувати
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveSchedule} startIcon={<SaveIcon />}>
              Зберегти
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default EditSchedulePage;