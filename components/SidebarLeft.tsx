import React from 'react';
import { Database, Bot, Search, HelpCircle, Settings, Calendar } from 'lucide-react';
import type { Page } from '../types';

interface SidebarLeftProps {
  isSidebarOpen: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  isSidebarOpen: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false, isSidebarOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
      active
        ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white'
        : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
    } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
    aria-label={label}
  >
    <Icon className="w-6 h-6 flex-shrink-0" />
    <span
      className={`ml-4 font-medium overflow-hidden whitespace-nowrap transition-all duration-200 ${
        isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
      }`}
    >
      {label}
    </span>
  </button>
);

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ isSidebarOpen, currentPage, onNavigate }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-700/50 p-4 flex-col justify-between flex transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-20'}`}>
      <div className="flex flex-col w-full space-y-6">
        {/* Header */}
        <div className={`flex items-center mb-4 h-8 ${isSidebarOpen ? 'px-3' : 'justify-center'}`}>
          <Database className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <span className={`text-xl font-bold text-slate-900 dark:text-white ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
            AI SQL
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col space-y-2 w-full">
            <NavItem icon={Bot} label="AI Assistant" active={currentPage === 'assistant'} isSidebarOpen={isSidebarOpen} onClick={() => onNavigate('assistant')} />
            <NavItem icon={Calendar} label="Appointments" active={currentPage === 'appointments'} isSidebarOpen={isSidebarOpen} onClick={() => onNavigate('appointments')} />
            <NavItem icon={Search} label="Search History" isSidebarOpen={isSidebarOpen} />
        </nav>
      </div>
      <div className="flex flex-col space-y-4 w-full">
        <NavItem icon={HelpCircle} label="Help & Support" isSidebarOpen={isSidebarOpen} />
        <NavItem icon={Settings} label="Settings" isSidebarOpen={isSidebarOpen} />
        {/* User Profile */}
        <div className={`flex items-center w-full p-2 mt-4 transition-colors duration-300 ${isSidebarOpen ? 'bg-slate-200 dark:bg-slate-800 rounded-lg' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            A
          </div>
          <div className={`ml-3 overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 max-w-0'}`}>
              <p className="font-semibold text-sm whitespace-nowrap text-slate-900 dark:text-white">Admin User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
};