import React from 'react';
import type { Appointment, Theme } from '../types';

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  theme: Theme;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, appointments, theme }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const startOfWeek = new Date(year, month, day - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`); // 7am to 9pm

  const getAppointmentsForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const hour = parseInt(time.split(':')[0]);
    return appointments.filter(apt => {
        if (apt.date !== dateStr) return false;
        const aptStartHour = parseInt(apt.time.split(':')[0]);
        return aptStartHour === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl">
        <div className="flex sticky top-0 bg-white dark:bg-slate-800 z-10">
            <div className="w-16 flex-shrink-0 border-r border-b border-slate-200 dark:border-slate-700/50"></div>
            {days.map(d => (
                <div key={d.toISOString()} className="flex-1 min-w-[120px] text-center p-2 border-r border-b border-slate-200 dark:border-slate-700/50">
                    <p className="text-sm text-slate-500">{d.toLocaleDateString('default', { weekday: 'short' })}</p>
                    <p className="text-lg font-semibold">{d.getDate()}</p>
                </div>
            ))}
        </div>
        <div className="flex">
            <div className="w-16 flex-shrink-0">
                {timeSlots.map(time => (
                    <div key={time} className="h-20 flex items-start justify-center pt-1 border-r border-b border-slate-200 dark:border-slate-700/50">
                        <span className="text-xs text-slate-400">{time}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-1">
                {days.map(d => (
                    <div key={d.toISOString()} className="flex-1 min-w-[120px] border-r border-slate-200 dark:border-slate-700/50">
                        {timeSlots.map(time => (
                            <div key={time} className="h-20 border-b border-slate-200 dark:border-slate-700/50 p-1">
                                {getAppointmentsForSlot(d, time).map(apt => (
                                    <div key={apt.id} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded p-1 text-xs">
                                        <p className="font-bold truncate">{apt.title}</p>
                                        <p>{apt.time}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
