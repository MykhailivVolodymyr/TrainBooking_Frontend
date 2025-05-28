export interface RoutePopularityReport {
    number: string; 
    direction: string; 
    numberOfTrips: number;
    numberOfTicketsSold: number; 
    averageOccupancyPercentage: number; 
  }
  

export interface RevenueReport {
    date: string; 
    ticketsSold: number; 
    revenue: number; 
    mostPopularTrain: string; 
  }
  