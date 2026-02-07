
import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { formatToYYYYMMDD } from '../utils/dateUtils.ts';
import { ICONS } from '../constants.tsx';
import { XCircle } from 'lucide-react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  slotIndex: number;
}

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, date, slotIndex }) => {
  const { updateShiftAssignment, shifts } = useAppContext();
  const dateKey = formatToYYYYMMDD(date);

  if (!isOpen) return null;

  const handleShiftSelect = (shiftId: string | null) => {
    updateShiftAssignment(dateKey, slotIndex, shiftId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-center">
              Asignar Turno
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="p-4 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {shifts.map(shift => (
              <li key={shift.id}>
                <button
                  onClick={() => handleShiftSelect(shift.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${shift.color} text-white`}
                >
                  <span className="mr-3">{ICONS[shift.icon] || null}</span>
                  <span className="font-semibold flex-grow">{shift.name} ({shift.abbreviation})</span>
                </button>
              </li>
            ))}
             <li>
                <button
                  onClick={() => handleShiftSelect(null)}
                  className="w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 hover:scale-105 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                >
                  <XCircle className="w-5 h-5 mr-3"/>
                  <span className="font-semibold">Quitar turno</span>
                </button>
              </li>
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
            Cancelar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;