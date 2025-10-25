import React from 'react';
import { Menu, ChevronDown, Bell, Sun, Moon } from 'lucide-react';
import type { Theme, Page } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, theme, onThemeToggle, currentPage }) => (
  <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
    <div className="flex items-center">
       <button onClick={onMenuClick} className="mr-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Toggle sidebar">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        {currentPage === 'assistant' ? 'AI SQL Assistant' : 'Appointments'}
      </h1>
      <button className="ml-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Project settings">
         <ChevronDown className="w-5 h-5" />
      </button>
    </div>
    <div className="flex items-center space-x-4">
       <button onClick={onThemeToggle} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Notifications">
        <Bell className="w-6 h-6" />
      </button>
      <button className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm" aria-label="User profile">
        A
      </button>
    </div>
  </header>
);