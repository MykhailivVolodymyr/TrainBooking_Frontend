export type ScheduleEntity = {
    scheduleId: number;
    trainId: number;
    trainNumber: string;
    routeCities: string;
    routeId: number;
    stationCount: number;
    realDepartureDateFromCity: string; // формат: "YYYY-MM-DD"
    departureDateFromStart: string;    // формат: "YYYY-MM-DD"
    fromStationName: string;
    arrivalTimeFromCity: string;       // формат: "HH:mm:ss"
    toStationName: string;
    arrivalDateToEnd: string;          // формат: "YYYY-MM-DD"
    realDepartureDateToCity: string;   // формат: "YYYY-MM-DD"
    arrivalTimeToCity: string;         // формат: "HH:mm:ss"
  };


export type ScheduleTransitEntity = {
    trainNumber: string;
    routeCities: string;
    time: string; // формат: "HH:mm:ss"
    stationName: string;
}
  
  