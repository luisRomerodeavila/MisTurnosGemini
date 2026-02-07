
import React, { useState, useEffect } from 'react';
import { Shift } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import ColorPicker from './ColorPicker.tsx';
import IconPicker from './IconPicker.tsx';
import { AVAILABLE_COLORS, ICONS } from '../constants.tsx';

interface ShiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift | null;
}

const ShiftFormModal: React.FC<ShiftFormModalProps> = ({ isOpen, onClose, shift }) => {
  const { addShift, updateShift } = useAppContext();
  const [formData, setFormData] = useState<Omit<Shift, 'id'>>({
    name: '',
    abbreviation: '',
    color: AVAILABLE_COLORS[0],
    icon: Object.keys(ICONS)[0],
  });

  useEffect(() => {
    if (shift) {
      setFormData(shift);
    } else {
      setFormData({ name: '', abbreviation: '', color: AVAILABLE_COLORS[5], icon: 'Briefcase' });
    }
  }, [shift]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'abbreviation') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase().slice(0, 3) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shift) {
      updateShift({ ...formData, id: shift.id });
    } else {
      const newShift: Shift = {
        ...formData,
        id: formData.name.toLowerCase().replace(/\s/g, '') + Date.now(),
      };
      addShift(newShift);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold">{shift ? 'Editar Turno' : 'Añadir Turno'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <div>
            <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Abreviatura (max 3)</label>
            <input type="text" name="abbreviation" id="abbreviation" value={formData.abbreviation} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <ColorPicker selectedColor={formData.color} onChange={(color) => setFormData(p => ({...p, color}))} />
          <IconPicker selectedIcon={formData.icon} onChange={(icon) => setFormData(p => ({...p, icon}))} />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 text-white transition-colors">{shift ? 'Guardar Cambios' : 'Añadir Turno'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftFormModal;