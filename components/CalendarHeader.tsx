import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { CalendarView, Technician } from '../types';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  filters: {
    category: string;
    technician: string;
    status: string;
  };
  onFilterChange: {
    category: (value: string) => void;
    technician: (value: string) => void;
    status: (value: string) => void;
  };
  filterOptions: {
    categories: string[];
    technicians: Technician[];
    statuses: string[];
  }
}

const FilterSelect: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}> = ({ value, onChange, children }) => (
    <select 
        value={value} 
        onChange={onChange}
        className="px-3 py-2 w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
    >
        {children}
    </select>
);


export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
    currentDate, 
    onPrev, 
    onNext, 
    view, 
    onViewChange,
    filters,
    onFilterChange,
    filterOptions,
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="flex flex-col mb-4 flex-shrink-0 gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search client"
                        className="pl-10 pr-4 py-2 w-full md:w-64 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center justify-center space-x-2 md:space-x-6">
                <button onClick={onPrev} className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" aria-label="Previous period">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl md:text-2xl font-semibold w-40 text-center text-slate-800 dark:text-slate-100">
                    {monthName} <span className="text-slate-400 dark:text-slate-500">{year}</span>
                </h2>
                <button onClick={onNext} className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" aria-label="Next period">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                {(['month', 'week', 'day'] as CalendarView[]).map((viewName) => (
                     <button 
                        key={viewName}
                        onClick={() => onViewChange(viewName)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md capitalize transition-colors ${
                            view === viewName 
                            ? 'text-white bg-blue-600' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-600/60'
                        }`}
                    >
                        {viewName}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterSelect value={filters.category} onChange={(e) => onFilterChange.category(e.target.value)}>
                {filterOptions.categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat === 'all' ? 'All Categories' : cat}</option>)}
            </FilterSelect>
            <FilterSelect value={filters.technician} onChange={(e) => onFilterChange.technician(e.target.value)}>
                <option value="all">All Technicians</option>
                {filterOptions.technicians.map(tech => <option key={tech.id} value={tech.id}>{tech.firstName} {tech.lastName}</option>)}
            </FilterSelect>
            <FilterSelect value={filters.status} onChange={(e) => onFilterChange.status(e.target.value)}>
                {filterOptions.statuses.map(status => <option key={status} value={status} className="capitalize">{status === 'all' ? 'All Statuses' : status}</option>)}
            </FilterSelect>
        </div>
    </div>
  );
};