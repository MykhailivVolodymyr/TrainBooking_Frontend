import { RevenueReport, RoutePopularityReport } from '@/types/reports';
import axios, { AxiosError } from 'axios';


export const getRoutePopularityReport = async (startDate: string, endDate: string): Promise<RoutePopularityReport[]> => {
  const url = `https://localhost:7160/api/AdminReports/popularity-route-report?startDate=${startDate}&endDate=${endDate}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'accept': 'text/plain' 
      },
      withCredentials: true,
    });

    if (typeof response.data === 'string') {
      try {
        const parsedData: RoutePopularityReport[] = JSON.parse(response.data);
        return parsedData;
      } catch (parseError) {
        console.error('Failed to parse response data as JSON:', parseError);
        throw new Error('Invalid response format: Expected JSON, got text');
      }
    }
    //Якщо відповідь вже об'єкт, повертаємо
    const data: RoutePopularityReport[] = response.data;
    return data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch route popularity report:', error.message);
      throw new Error(`Failed to fetch route popularity report: ${error.message}`);
    } else {
      console.error('Failed to fetch route popularity report:', error);
      throw error;
    }
  }
};




export const getRevenueReport = async (startDate: string, endDate: string): Promise<RevenueReport[]> => {
    const url = `https://localhost:7160/api/AdminReports/revenue-report?startDate=${startDate}&endDate=${endDate}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'accept': 'text/plain'
            },
             withCredentials: true, 
        });

        if (typeof response.data === 'string') {
            try {
                const parsedData: RevenueReport[] = JSON.parse(response.data);
                return parsedData;
            } catch (parseError) {
                console.error('Не вдалося розпарсити дані відповіді як JSON:', parseError);
                throw new Error('Невірний формат відповіді: Очікувався JSON, отримано текст');
            }
        }
        const data: RevenueReport[] = response.data;
        return data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Не вдалося отримати звіт про доходи:', error.message);
            throw new Error(`Не вдалося отримати звіт про доходи: ${error.message}`);
        } else {
            console.error('Не вдалося отримати звіт про доходи:', error);
            throw error;
        }
    }
};





export const downloadReportCsv = async (reportType: string, startDate: string, endDate: string): Promise<void> => {
    const url = `https://localhost:7160/api/AdminReports/export-csv?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`;
    try {
        const response = await axios.get(url, {
            responseType: 'blob', // Отримуємо дані у форматі Blob
            withCredentials: true,
        });

        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        // Визначаємо ім'я файлу
        const fileNameHeader = response.headers['content-disposition'];
        let filename = `${reportType}_report.csv`; // Ім'я файлу за замовчуванням

        if (fileNameHeader) {
            // Спробуємо витягти ім'я файлу з заголовка Content-Disposition
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(fileNameHeader);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, ''); // Видаляємо лапки, якщо є
            }
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        console.log(`CSV звіт "${reportType}" успішно завантажено.`);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Помилка завантаження CSV звіту "${reportType}":`, error.message);
            throw new Error(`Помилка завантаження CSV звіту "${reportType}": ${error.message}`);
        } else {
            console.error(`Помилка завантаження CSV звіту "${reportType}":`, error);
            throw error;
        }
    }
};
