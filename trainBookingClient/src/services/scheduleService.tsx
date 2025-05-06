import axios from 'axios';
import { ScheduleTransitEntity, ScheduleEntity  } from '../types/schedule';

export const getScheduleTransit = async (city: string, date: string, isArrival: boolean): Promise<ScheduleTransitEntity[]> => {
    try {
      const url = `https://localhost:7160/api/Schedule/GetScheduleTransit?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}&isArrival=${isArrival}`;
      
      const response = await axios.get<ScheduleTransitEntity[]>(url);
      return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Status code:', error.response.status);
          console.error('Response data:', error.response.data);
        }
    
        throw error; 
      }
  };

  export const getSchedule = async (cityFrom: string, cityTo: string, date: string): Promise<ScheduleEntity[]> => {
    try {
      const url = `https://localhost:7160/api/Schedule/GetSchedule?cityFrom=${encodeURIComponent(cityFrom)}&cityTo=${encodeURIComponent(cityTo)}&date=${encodeURIComponent(date)}`;
      
      const response = await axios.get<ScheduleEntity[]>(url);
      
      return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Status code:', error.response.status);
          console.error('Response data:', error.response.data);
        }
    
        throw error; 
      }
  };



  export function getFilteredTransit(transitData: ScheduleTransitEntity[]): ScheduleTransitEntity[] {
    const now = new Date();
  
    // Фільтруємо записи, які ще не відбулись
    const upcomingData = transitData.filter((item) => {
      const [hours, minutes, seconds] = item.time.split(':').map(Number);
      const tripTime = new Date(now);
      tripTime.setHours(hours, minutes, seconds, 0);
  
      return tripTime >= now;
    });
  
    // Сортуємо за часом
    const sortedData = upcomingData.sort((a, b) => {
      const [aHours, aMinutes, aSeconds] = a.time.split(':').map(Number);
      const [bHours, bMinutes, bSeconds] = b.time.split(':').map(Number);
  
      const aTime = new Date(now);
      aTime.setHours(aHours, aMinutes, aSeconds, 0);
  
      const bTime = new Date(now);
      bTime.setHours(bHours, bMinutes, bSeconds, 0);
  
      return aTime.getTime() - bTime.getTime();
    });
  
    return sortedData.slice(0, 6);
  }
  







export const isPast = (departureDate: string, departureTime: string): boolean => {
  const [year, month, day] = departureDate.split('-');
  const [hours, minutes] = departureTime.split(':');
  const departureDateTime = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1, // Місяці в JavaScript починаються з 0
    parseInt(day, 10),
    parseInt(hours, 10),
    parseInt(minutes, 10)
  );
  return departureDateTime.getTime() < Date.now();
};

export const sortAndFilterData = (scheduleData: ScheduleEntity[]): ScheduleEntity[] => {
  return scheduleData
    .sort((a, b) => {
      const timeA = a.arrivalTimeFromCity;
      const timeB = b.arrivalTimeFromCity;
      return timeA.localeCompare(timeB); // Сортування за часом відправлення
    })
    .filter((item) => !isPast(item.realDepartureDateFromCity, item.arrivalTimeFromCity));
};