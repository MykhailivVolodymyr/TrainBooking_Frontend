import axios from 'axios';
import { ScheduleEntity } from '@/types/schedule';
import { TrainStructure } from '@/types/trainStructure'; // Шлях до вашого файлу з типами

export const getAvailableSeats = async (trainId: number): Promise<TrainStructure> => {
  try {
    const url = `https://localhost:7160/api/Train/${trainId}/AvalibleSeats`;

    const response = await axios.get<TrainStructure>(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    throw error;
  }
};





