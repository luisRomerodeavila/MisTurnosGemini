
import React from 'react';
import { Page } from '../types.ts';
import { Calendar, BarChart2, Settings } from 'lucide-react';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-cyan-500 dark:text-cyan-400';
  const inactiveClasses = 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-300';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-t border-gray-200 dark:border-gray-700 flex justify-around z-20">
      <NavItem
        label="Calendario"
        icon={<Calendar />}
        isActive={activePage === 'calendar'}
        onClick={() => setActivePage('calendar')}
      />
      <NavItem
        label="Estadísticas"
        icon={<BarChart2 />}
        isActive={activePage === 'statistics'}
        onClick={() => setActivePage('statistics')}
      />
      <NavItem
        label="Ajustes"
        icon={<Settings />}
        isActive={activePage === 'settings'}
        onClick={() => setActivePage('settings')}
      />
    </nav>
  );
};

export default BottomNav;