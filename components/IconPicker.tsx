
import React from 'react';
import { ICONS } from '../constants';

interface IconPickerProps {
  selectedIcon: string;
  onChange: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icono</label>
      <div className="grid grid-cols-8 sm:grid-cols-11 gap-2">
        {Object.entries(ICONS).map(([name, icon]) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 ${selectedIcon === name ? 'bg-cyan-500 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-cyan-400 scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-110'}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;