import React from 'react';
import type { Appointment, AppointmentCategory, Theme } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  appointments: Appointment[];
  theme: Theme;
}

const CATEGORY_COLORS: Record<AppointmentCategory | 'Other', { bg: string; text: string; darkBg: string; darkText:string }> = {
    'Haircut and Styling': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Manicure': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Pedicure': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/50', darkText: 'dark:text-green-300' },
    'Facial cleansing': { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900/50', darkText: 'dark:text-yellow-300' },
    'Appointment': { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900/50', darkText: 'dark:text-yellow-300' },
    'Window repair': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/50', darkText: 'dark:text-green-300' },
    'Office construction': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Dental cleaning': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Test': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/50', darkText: 'dark:text-green-300' },
    'Wall painting': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Doctor\'s appointment': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Performance review': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Nutrition appointment': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Gardening': { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900/50', darkText: 'dark:text-yellow-300' },
    'Makeup': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/50', darkText: 'dark:text-green-300' },
    'Periodontics': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Roof repair': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    'Other': { bg: 'bg-slate-100', text: 'text-slate-800', darkBg: 'dark:bg-slate-700', darkText: 'dark:text-slate-300' },
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, appointments, theme }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDayOfWeek = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getAppointmentsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const dayCells = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    dayCells.push(<div key={`empty-start-${i}`} className="border-r border-b border-slate-200 dark:border-slate-700/50"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const dailyAppointments = getAppointmentsForDay(day);
    dayCells.push(
      <div key={`day-${day}`} className="border-r border-b border-slate-200 dark:border-slate-700/50 p-2 min-h-[120px] flex flex-col">
        <span className={`text-sm font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
        <div className="mt-1 space-y-1 overflow-y-auto">
            {dailyAppointments.map(apt => {
                const colors = CATEGORY_COLORS[apt.category] || CATEGORY_COLORS['Other'];
                return (
                    <div key={apt.id} className={`p-1.5 rounded-md text-xs ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} cursor-pointer hover:opacity-80`}>
                        <p className="font-semibold truncate">{apt.title}</p>
                        <p className="opacity-80">{apt.time}</p>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }
  
  const totalCells = dayCells.length;
  const cellsToFill = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < cellsToFill; i++) {
     dayCells.push(<div key={`empty-end-${i}`} className="border-r border-b border-slate-200 dark:border-slate-700/50"></div>);
  }

  const mobileDayList = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayName = date.toLocaleDateString('default', { weekday: 'short' });
    const dailyAppointments = getAppointmentsForDay(day);
    mobileDayList.push(
        <div key={`mobile-day-${day}`} className="py-3 border-b border-slate-200 dark:border-slate-700/50">
            <div className="flex items-baseline space-x-3 mb-2">
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{day}</span>
                <span className="text-sm font-medium text-slate-500">{dayName}</span>
            </div>
            <div className="space-y-2">
                {dailyAppointments.length > 0 ? dailyAppointments.map(apt => {
                    const colors = CATEGORY_COLORS[apt.category] || CATEGORY_COLORS['Other'];
                    return (
                        <div key={apt.id} className={`p-2 rounded-md text-sm flex items-center space-x-3 ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`}>
                            <div className="font-semibold">{apt.time}</div>
                            <div>{apt.title}</div>
                        </div>
                    );
                }) : <div className="text-sm text-slate-400 dark:text-slate-500 pl-2">No appointments</div>}
            </div>
        </div>
    );
  }


  return (
    <div className="flex-1 overflow-y-auto">
      {/* Desktop Grid View */}
      <div className="hidden md:grid flex-1 grid-cols-7 grid-rows-[auto,1fr] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center p-3 font-semibold text-sm text-slate-600 dark:text-slate-400 border-b border-r border-slate-200 dark:border-slate-700/50">
            {day}
          </div>
        ))}
        {dayCells}
      </div>
      {/* Mobile List View */}
      <div className="md:hidden px-2">
        {mobileDayList}
      </div>
    </div>
  );
};