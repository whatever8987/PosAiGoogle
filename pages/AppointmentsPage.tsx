import React, { useState, useMemo } from 'react';
import type { Theme, CalendarView, Page, AppointmentStatus } from '../types';
import { CalendarHeader } from '../components/CalendarHeader';
import { CalendarGrid } from '../components/CalendarGrid';
import { MOCK_APPOINTMENTS, MOCK_TECHNICIANS } from '../constants';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { Bot } from 'lucide-react';

interface AppointmentsPageProps {
  theme: Theme;
  onNavigate: (page: Page) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ theme, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 11, 1)); // Set to Dec 2023 for mock data
  const [view, setView] = useState<CalendarView>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const categories = useMemo(() => ['all', ...Array.from(new Set(MOCK_APPOINTMENTS.map(a => a.category)))], []);
  const statuses: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled'];

  const filteredAppointments = useMemo(() => {
    return MOCK_APPOINTMENTS.filter(apt => {
        const categoryMatch = categoryFilter === 'all' || apt.category === categoryFilter;
        const technicianMatch = technicianFilter === 'all' || apt.technicianId === technicianFilter;
        const statusMatch = statusFilter === 'all' || apt.status === statusFilter;
        return categoryMatch && technicianMatch && statusMatch;
    });
  }, [categoryFilter, technicianFilter, statusFilter]);

  const handlePrev = () => {
    setCurrentDate(prev => {
        if (view === 'month') return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
        if (view === 'week') return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7);
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1);
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
        if (view === 'month') return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
        if (view === 'week') return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7);
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1);
    });
  };

  const renderView = () => {
    switch(view) {
        case 'month':
            return <CalendarGrid 
                        currentDate={currentDate}
                        appointments={filteredAppointments}
                        theme={theme}
                    />;
        case 'week':
            return <WeekView 
                        currentDate={currentDate}
                        appointments={filteredAppointments}
                        theme={theme}
                    />;
        case 'day':
            return <DayView 
                        currentDate={currentDate}
                        appointments={filteredAppointments}
                        theme={theme}
                    />;
        default:
            return null;
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-800 p-2 md:p-6 relative">
        <CalendarHeader 
            currentDate={currentDate}
            onPrev={handlePrev}
            onNext={handleNext}
            view={view}
            onViewChange={setView}
            filters={{
                category: categoryFilter,
                technician: technicianFilter,
                status: statusFilter,
            }}
            onFilterChange={{
                category: setCategoryFilter,
                technician: setTechnicianFilter,
                status: setStatusFilter
            }}
            filterOptions={{
                categories,
                technicians: MOCK_TECHNICIANS,
                statuses: ['all', ...statuses]
            }}
        />
        {renderView()}

        <button 
            onClick={() => onNavigate('assistant')}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-20"
            aria-label="Open AI Assistant"
        >
            <Bot className="w-7 h-7" />
        </button>
    </div>
  );
};