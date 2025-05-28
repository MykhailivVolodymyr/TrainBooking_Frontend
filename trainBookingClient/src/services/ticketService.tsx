import { ResponseData, Ticket, TicketResult, Trip } from "@/types/ticket";
import axios from "axios";

export const purchaseTickets = async (tickets: Ticket[], trip: Trip): Promise<void> => {
    try {
      const url = 'https://localhost:7160/api/Ticket/purchase';
      const data = { tickets, trip };
  
      await axios.post(url, data, { 
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*' 
        },
        withCredentials: true,
      });
     
  
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Status code:', error.response.status);
        console.error('Response data:', error.response.data);
        // You might want to throw a specific error type or handle it differently
        throw new Error(`Failed to purchase tickets: ${error.message}`); // Improved error message
      }
      throw error;
    }
  };





  export const getTickets = async (): Promise<TicketResult[]> => {
    const url = 'https://localhost:7160/api/Ticket/user/tickets';
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        withCredentials: true,
      });
      const data: TicketResult[] = response.data;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch tickets:', error.message);
        throw new Error(`Failed to fetch tickets: ${error.message}`);
      } else {
        console.error('Failed to fetch tickets:', error);
        throw error;
      }
    }
  };


export const returnTicket = async (ticketId: string): Promise<void> => {
    const url = `https://localhost:7160/api/Ticket/tickets/${ticketId}/return`;
    try {
        await axios.patch(url, {}, { // Другий аргумент - це тіло запиту (тут порожнє), третій - конфігурація
            headers: {
                'accept': '*/*'
            },
            withCredentials: true,
        });
        console.log(`Квиток з ID ${ticketId} успішно повернуто.`);
        // Тут можна додати додаткову логіку після успішного повернення
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to return ticket with ID ${ticketId}:`, error.message);
            throw new Error(`Failed to return ticket with ID ${ticketId}: ${error.message}`);
        } else {
            console.error(`Failed to return ticket with ID ${ticketId}:`, error);
            throw error;
        }
    }
};



export const downloadTicketPdf = async (ticketId: number): Promise<void> => {
    const url = `https://localhost:7160/api/Ticket/user/ticket/${ticketId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/pdf' // Важливо вказати, що ми очікуємо PDF
            },
            responseType: 'blob', // Вказуємо, що очікуємо отримати Blob (двійкові дані)
            withCredentials: true,
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const fileNameHeader = response.headers['content-disposition'];
        let filename = `ticket-${ticketId}.pdf`; // За замовчуванням

        if (fileNameHeader) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(fileNameHeader);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        console.log(`PDF квитка з ID ${ticketId} успішно завантажено.`);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Не вдалося завантажити PDF квитка з ID ${ticketId}:`, error.message);
            throw new Error(`Не вдалося завантажити PDF квитка з ID ${ticketId}: ${error.message}`);
        } else {
            console.error(`Не вдалося завантажити PDF квитка з ID ${ticketId}:`, error);
            throw error;
        }
    }
};