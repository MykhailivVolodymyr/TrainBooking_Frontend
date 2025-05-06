export interface Seat {
    seatId: number;
    seatNumber: number;
    seatType: string;
  }
  
  export interface Carriage {
    carriageId: number;
    carriageType: string;
    capacity: number;
    seats: Seat[];
  }
  
  export interface TrainStructure {
    trainNumber: string;
    trainType: string | null;
    carriages: Carriage[];
  }