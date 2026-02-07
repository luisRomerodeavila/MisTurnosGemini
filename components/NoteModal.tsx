
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { formatToYYYYMMDD } from '../utils/dateUtils.ts';
import { Trash2 } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, date }) => {
  const { activeCalendar, updateNote } = useAppContext();
  const dateKey = formatToYYYYMMDD(date);
  
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existingNote = activeCalendar?.notes?.[dateKey] || '';
      setNoteText(existingNote);
    }
  }, [isOpen, dateKey, activeCalendar]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateNote(dateKey, noteText);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      updateNote(dateKey, null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-center">
              Nota del Día
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="p-4 flex-grow">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Escribe tu nota aquí..."
            className="w-full h-40 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
            autoFocus
          />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between space-x-2">
            <button
                onClick={handleDelete}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={!noteText}
                title="Eliminar Nota"
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

export default NoteModal;