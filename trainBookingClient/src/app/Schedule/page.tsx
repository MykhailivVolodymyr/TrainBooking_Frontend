'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSchedule, sortAndFilterData } from '@/services/scheduleService'; // шляхи адаптуй, якщо потрібно
import { ScheduleEntity } from '@/types/schedule'; // імпортуй тип, якщо є
import TrainCard from '@/components/TrainCard'; // Шлях до вашого компонента TrainCard

export default function ResultsPage() {
  const searchParams = useSearchParams();

  const cityFrom = searchParams.get('from') || '';
  const cityTo = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [data, setData] = useState<ScheduleEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSchedule(cityFrom, cityTo, date);
        setData(result);
      } catch (err: any) {
        console.error('Помилка при отриманні розкладу:', err);
        setError('Виникла помилка при завантаженні розкладу.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (cityFrom && cityTo && date) {
      fetchSchedule();
    }
  }, [cityFrom, cityTo, date]);

  
 // Отримуємо відсортовані та відфільтровані дані
 const sortedAndFilteredData = sortAndFilterData(data);
 
  if (loading) {
    return <p>Завантаження розкладу...</p>;
  }

  if (error) {
    return <p>Помилка: {error}</p>;
  }

  return (
    <>
      {sortedAndFilteredData.length > 0 ? (
        sortedAndFilteredData.map((scheduleItem) => (
          <TrainCard
            key={`${scheduleItem.scheduleId}-${scheduleItem.fromStationName}-${scheduleItem.toStationName}`}
            schedule={scheduleItem}
          />
        ))
      ) : (
        <p>Не знайдено жодного актуального розкладу за вашим запитом.</p>
      )}
    </>
  );
}