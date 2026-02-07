
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Shift } from '../types';
import { formatToYYYYMMDD } from '../utils/dateUtils';
import { Trash2 } from 'lucide-react';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  shift: Shift;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ isOpen, onClose, date, shift }) => {
  const { activeCalendar, updateAlarm } = useAppContext();
  const dateKey = formatToYYYYMMDD(date);
  
  const [time, setTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existingAlarm = activeCalendar?.alarms?.[dateKey]?.[shift.id] || '';
      setTime(existingAlarm);
    }
  }, [isOpen, dateKey, shift.id, activeCalendar]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (time) {
      updateAlarm(dateKey, shift.id, time);
      onClose();
    } else {
      alert("Por favor, selecciona una hora de inicio para el turno.");
    }
  };

  const handleDelete = () => {
    updateAlarm(dateKey, shift.id, null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-center">
              Hora de Inicio para {shift.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        
        <div className="p-6 flex-grow flex flex-col items-center justify-center">
            <label htmlFor="alarm-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hora de inicio del turno</label>
            <input
                id="alarm-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-2xl text-center focus:ring-cyan-500 focus:border-cyan-500"
                autoFocus
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Recibirás una notificación 15 minutos antes de esta hora.</p>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between space-x-2">
            <button
                onClick={handleDelete}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={!time}
                title="Eliminar Recordatorio"
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex-grow flex space-x-2">
                <button
                onClick={onClose}
                className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                Cancelar
                </button>
                <button
                onClick={handleSave}
                className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                Guardar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
