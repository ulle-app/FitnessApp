import React from 'react';
import { Flame, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

const getMonthDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const activeDays = [17, 18, 21, 24, 25, 26, 27, 30, 31]; // Example for July
const activeDaysAugust = [1, 4, 5, 6, 12, 13, 15, 17, 18, 19, 22, 23, 24, 25, 26, 29];

const CalendarStreak: React.FC = () => {
  const { user } = useUser();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const days = getMonthDays(year, month);
  const firstDay = days[0].getDay();

  // For demo, use July and August 2024
  const isJuly = month === 6;
  const isAugust = month === 7;
  const showJuly = true;
  const showAugust = true;

  console.log('User context:', user);

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-3xl shadow-xl p-4 pt-6 flex flex-col items-center">
      {/* Top summary cards */}
      <div className="flex w-full gap-3 mb-4">
        <div className="flex-1 bg-gray-50 rounded-xl flex flex-col items-center py-3 shadow">
          <Flame className="w-6 h-6 text-orange-500 mb-1" />
          <span className="font-bold text-lg text-gray-900">31 weeks</span>
          <span className="text-xs text-gray-500">Streak</span>
        </div>
        <div className="flex-1 bg-gray-50 rounded-xl flex flex-col items-center py-3 shadow">
          <Moon className="w-6 h-6 text-blue-500 mb-1" />
          <span className="font-bold text-lg text-gray-900">0 days</span>
          <span className="text-xs text-gray-500">Rest</span>
        </div>
      </div>
      {/* Calendar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 px-2">
          <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900">{monthName} {year}</span>
          <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400" disabled>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
          {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty days for first week */}
          {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
          {/* Days of month */}
          {days.map((date, i) => {
            const day = date.getDate();
            const isActive = (isJuly && activeDays.includes(day)) || (isAugust && activeDaysAugust.includes(day));
            return (
              <div key={i} className="py-1">
                {isActive ? (
                  <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-semibold">
                    {day}
                  </div>
                ) : (
                  <span className="text-gray-500">{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarStreak; 