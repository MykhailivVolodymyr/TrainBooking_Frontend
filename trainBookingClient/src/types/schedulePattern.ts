export interface SchedulePattern {
    trainId: number;
    trainNumber: string;
    frequencyType: string; // Наприклад: "Щоденно", "Конкретні дні тижня", тощо
    daysOfWeek: string | null; // Рядок типу "1,3,5", де 1 = понеділок, 7 = неділя
    dayParity: "Парні" | "Непарні" | null; // Якщо задано по парних/непарних числах
  }
  