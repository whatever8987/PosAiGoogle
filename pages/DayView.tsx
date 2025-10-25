import React from 'react';
import type { Appointment, Theme } from '../types';

interface DayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  theme: Theme;
}

export const DayView: React.FC<DayViewProps> = ({ currentDate, appointments, theme }) => {
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7;
    return `${hour < 10 ? '0' : ''}${hour}:00`;
  }); // 7:00 AM to 9:00 PM

  const dateStr = currentDate.toISOString().split('T')[0];
  const dailyAppointments = appointments.filter(apt => apt.date === dateStr);

  const getAppointmentPosition = (time: string) => {
    const [start, end] = time.split('-').map(t => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    });
    const top = (start - 7) * 80; // 80px per hour, starting from 7am
    const height = (end - start) * 80;
    return { top, height };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl">
        <div className="flex">
            {/* Time Gutter */}
            <div className="w-16 flex-shrink-0">
                {timeSlots.map(time => (
                    <div key={time} className="h-20 relative border-r border-b border-slate-200 dark:border-slate-700/50">
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-slate-400">{time}</span>
                    </div>
                ))}
            </div>
            {/* Appointments Area */}
            <div className="flex-1 relative">
                {timeSlots.map(time => (
                    <div key={time} className="h-20 border-b border-slate-200 dark:border-slate-700/50"></div>
                ))}
                {dailyAppointments.map(apt => {
                    const { top, height } = getAppointmentPosition(apt.time);
                    return (
                        <div 
                            key={apt.id}
                            className="absolute left-2 right-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded p-2 text-sm z-10 overflow-hidden"
                            style={{ top: `${top}px`, height: `${height}px` }}
                        >
                            <p className="font-bold truncate">{apt.title}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
