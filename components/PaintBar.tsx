
import React from 'react';
import { Shift } from '../types';
import { ICONS } from '../constants';
import { XCircle } from 'lucide-react';

interface PaintBarProps {
    shifts: Shift[];
    selectedShiftId: string | null;
    onSelectShift: (shiftId: string | null) => void;
}

const PaintBar: React.FC<PaintBarProps> = ({ shifts, selectedShiftId, onSelectShift }) => {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <button
                    onClick={() => onSelectShift(null)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-16 h-16
                    ${selectedShiftId === null ? 'bg-red-500 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-red-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                >
                    <XCircle className="w-6 h-6" />
                    <span className="text-xs mt-1">Quitar</span>
                </button>
                {shifts.map(shift => (
                    <button
                        key={shift.id}
                        onClick={() => onSelectShift(shift.id)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-lg text-white transition-all duration-200 w-16 h-16 ${shift.color}
                        ${selectedShiftId === shift.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-cyan-400 scale-105' : 'opacity-70 hover:opacity-100'}`}
                    >
                        {ICONS[shift.icon]}
                        <span className="text-xs font-bold mt-1">{shift.abbreviation}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaintBar;