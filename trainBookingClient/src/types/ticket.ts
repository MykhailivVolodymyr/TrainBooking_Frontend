 export interface Ticket {
    seatId: number;
    price: number;
  }
  
  export interface Trip {
    trainId: number;
    departureTime: string;
    arrivalTime: string;
    startStationName: string;
    endStationName: string;
    sheduleId: number;
  }
  
  export interface ResponseData {
    tickets: Ticket[];
    trip: Trip;
  }



 export interface TicketResult {
    ticketId: number;
    fullName: string;
    trainNumber: string;
    carriageNumber: number;
    carriageType: string;
    seatNumber: number;
    seatType: string;
    departureStation: string;
    departureCity: string;
    arrivalStation: string;
    arrivalCity: string;
    departureTime: string; // Використовуємо string, оскільки вхідне значення - рядок
    arrivalTime: string;   // Використовуємо string, оскільки вхідне значення - рядок
    purchaseDate: string;  // Використовуємо string, оскільки вхідне значення - рядок
    ticketPrice: number;
  }