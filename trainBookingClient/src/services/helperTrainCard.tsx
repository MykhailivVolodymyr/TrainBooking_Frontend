  // styles/trainCardStyles.ts
  import { ScheduleEntity } from '@/types/schedule';
import { blue } from '@mui/material/colors';

export const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    return `${formattedDay}.${formattedMonth}`;
  };
  
  export const calculateTravelTime = (
    departureDate: string,
    departureTime: string,
    arrivalDate: string,
    arrivalTime: string
  ): string => {
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
  
    let timeDifferenceMs = arrivalDateTime.getTime() - departureDateTime.getTime();
  
    if (timeDifferenceMs < 0) {
      arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
      timeDifferenceMs = arrivalDateTime.getTime() - departureDateTime.getTime();
    }
  
    const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return `${hours} год ${minutes} хв`;
  };




  // ціна в TrainCard
  
interface CarriageTypePriceMultiplier {
  [key: string]: number;
}

const carriageTypeMultipliers: CarriageTypePriceMultiplier = {
  'плацкарт': 1,
  'купе': 1.5,
  'люкс': 2.3,
  'сидячі - 2 клас': 1,
  'сидячі - 1 клас': 1.5,
};

const basePricePerHour = 40; // Базова ціна за годину подорожі (можете налаштувати)

export const calculateCarriagePrice = (
  schedule: ScheduleEntity,
  carriageType: string
): number | null => {
  const multiplier = carriageTypeMultipliers[carriageType.toLowerCase()];

  if (multiplier === undefined) {
    console.warn(`Невідомий тип вагона: ${carriageType}`);
    return null;
  }

  const departureDateTime = new Date(
    `${schedule.realDepartureDateFromCity}T${schedule.arrivalTimeFromCity}`
  );
  const arrivalDateTime = new Date(
    `${schedule.realDepartureDateToCity}T${schedule.arrivalTimeToCity}`
  );

  let timeDifferenceMs = arrivalDateTime.getTime() - departureDateTime.getTime();

  if (timeDifferenceMs < 0) {
    arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
    timeDifferenceMs = arrivalDateTime.getTime() - departureDateTime.getTime();
  }

  const travelDurationHours = timeDifferenceMs / (1000 * 60 * 60);
  const price = travelDurationHours * basePricePerHour * multiplier;

  return Math.round(price) > 0 ? Math.round(price) : 70; // Мінімальна ціна 100, щоб уникнути нульових або від'ємних значень
};


// стилі для TrainCard


export const modalStyle = {
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

export const timelineDot = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: blue[500],
};

export const timelineEmptyDot = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: `2px solid ${blue[500]}`,
  backgroundColor: 'transparent',
};

export const timelineLine = {
  width: 2,
  backgroundColor: blue[200],
  position: 'absolute' as 'absolute',
  zIndex: -1,
};

export const stationInfo = {
  marginLeft: 16,
};