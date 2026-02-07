
import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { ChevronDown } from 'lucide-react';

const CalendarSwitcher: React.FC = () => {
    const { calendars, activeCalendar, switchCalendar } = useAppContext();

    if (!activeCalendar) {
        return null;
    }

    return (
        <div className="relative">
            <select
                value={activeCalendar.id}
                onChange={(e) => switchCalendar(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 pr-8"
            >
                {calendars.map(cal => (
                    <option key={cal.id} value={cal.id}>
                        {cal.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
};

export default CalendarSwitcher;