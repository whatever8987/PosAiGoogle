import React from 'react';
import { Menu, ChevronDown, Bell, Sun, Moon } from 'lucide-react';
import type { Theme, Page } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  currentPage: Page;
}

const pageTitles: Record<Page, string> = {
    assistant: 'AI SQL Assistant',
    appointments: 'Appointments',
    integrations: 'Integrations',
    insights: 'AI Insights',
    predictions: 'Predictions Dashboard',
    recommendations: 'AI Recommendations',
    login: 'Login',
    register: 'Register',
    // FIX: Add missing 'landing' property to satisfy the 'Record<Page, string>' type.
    landing: 'Welcome',
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, theme, onThemeToggle, currentPage }) => (
  <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
    <div className="flex items-center">
       <button onClick={onMenuClick} className="mr-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Toggle sidebar">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        {pageTitles[currentPage] || 'Dashboard'}
      </h1>
      <button className="ml-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Project settings">
         <ChevronDown className="w-5 h-5" />
      </button>
    </div>
    <div className="flex items-center space-x-4">
       <button onClick={onThemeToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      <button className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications">
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
      </button>
      <button className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm" aria-label="User profile">
        A
      </button>
    </div>
  </header>
);