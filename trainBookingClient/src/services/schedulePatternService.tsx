import { SchedulePattern } from '@/types/schedulePattern';
import axios, { AxiosError } from 'axios';



/**
 * Отримує всі розклади руху.
 * @returns Масив об'єктів SchedulePattern.
 * @throws Помилка у разі невдалого запиту.
 */
export const getSchedulePatterns = async (): Promise<SchedulePattern[]> => {
    const url = 'https://localhost:7160/api/SchedulePattern/schedule-patterns/all';
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'text/plain'
            },
            withCredentials: true,
        });

        const data: SchedulePattern[] = response.data; 
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Failed to fetch schedule patterns:', error.message);
            throw new Error(`Failed to fetch schedule patterns: ${error.message}`);
        } else {
            console.error('Failed to fetch schedule patterns:', error);
            throw error;
        }
    }
};



/**
 * Отримує розклад руху для конкретного поїзда за його номером.
 * @param trainNumber Номер поїзда, для якого потрібно отримати розклад.
 * @returns Об'єкт SchedulePattern, що представляє розклад руху поїзда.
 * @throws Помилка у разі невдалого запиту.
 */
export const getTrainSchedulePattern = async (trainNumber: string): Promise<SchedulePattern> => {
    const url = `https://localhost:7160/api/SchedulePattern/train/${encodeURIComponent(trainNumber)}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'text/plain' 
            },
            withCredentials: true,
        });

        const data: SchedulePattern = response.data;
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to fetch schedule pattern for train ${trainNumber}:`, error.message);
            throw new Error(`Failed to fetch schedule pattern for train ${trainNumber}: ${error.message}`);
        } else {
            console.error(`Failed to fetch schedule pattern for train ${trainNumber}:`, error);
            throw error;
        }
    }
};




/**
 * Оновлює розклад руху для конкретного поїзда.
 * @param trainNumber Номер поїзда, для якого потрібно оновити розклад.
 * @param schedulePattern Об'єкт SchedulePattern з оновленими даними.
 * @returns Оновлений об'єкт SchedulePattern.
 * @throws Помилка у разі невдалого запиту.
 */
export const updateTrainSchedulePattern = async (
    trainNumber: string,
    schedulePattern: SchedulePattern
): Promise<SchedulePattern> => {
    const url = `https://localhost:7160/api/SchedulePattern/train/${encodeURIComponent(trainNumber)}/update`;
    try {
        const response = await axios.put(url, schedulePattern, {
            headers: {
                'Accept': '*/*', // Accept all content types
                'Content-Type': 'application/json', // Specify the content type of the request body
            },
            withCredentials: true,
        });
        const data: SchedulePattern = response.data;
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to update schedule pattern for train ${trainNumber}:`, error.message);
            throw new Error(
                `Failed to update schedule pattern for train ${trainNumber}: ${error.message}`
            );
        } else {
            console.error(`Failed to update schedule pattern for train ${trainNumber}:`, error);
            throw error;
        }
    }
};

