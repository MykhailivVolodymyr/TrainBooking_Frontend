import { RouteDetailsEntity } from '@/types/routeDetails';
import axios from 'axios';


export const getRouteDetails = async (trainNumber: string): Promise<RouteDetailsEntity[]> => {
  try {
    const url = `https://localhost:7160/api/Route/${encodeURIComponent(trainNumber)}/stations`;
    const response = await axios.get<RouteDetailsEntity[]>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Статус код:', error.response.status);
      console.error('Дані відповіді:', error.response.data);
    }
    throw error;
  }
};