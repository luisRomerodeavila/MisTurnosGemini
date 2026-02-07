
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Shift } from '../types.ts';
import ShiftFormModal from './ShiftFormModal.tsx';
import InputDialog from './InputDialog.tsx';
import SyncModal from './SyncModal.tsx';
import { ICONS } from '../constants.tsx';
import { Plus, Edit, Trash2, ShieldCheck, Sun, Moon, Laptop } from 'lucide-react';
import { BackupFrequency } from '../types.ts';

const SettingsView: React.FC = () => {
  const { calendars, activeCalendar, addCalendar, renameCalendar, deleteCalendar, shifts, deleteShift, theme, setTheme, backupFrequency, setBackupFrequency } = useAppContext();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputModalConfig, setInputModalConfig] = useState<{
    title: string;
    label: string;
    initialValue?: string;
    onConfirm: (value: string) => void;
  } | null>(null);

  const handleAddNewShift = () => {
    setEditingShift(null);
    setIsShiftModalOpen(true);
  };
  
  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setIsShiftModalOpen(true);
  };
  
  const handleDeleteShift = (shiftId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno? Se eliminará de todos los calendarios.')) {
      deleteShift(shiftId);
    }
  };
  
  const handleAddCalendar = () => {
    setInputModalConfig({
        title: "Nuevo Calendario",
        label: "Nombre del Calendario",
        onConfirm: (name) => {
            addCalendar(name);
            setIsInputModalOpen(false);
        }
    });
    setIsInputModalOpen(true);
  };
  
  const handleRenameCalendar = (id: string, currentName: string) => {
    setInputModalConfig({
        title: "Renombrar Calendario",
        label: "Nuevo Nombre",
        initialValue: currentName,
        onConfirm: (newName) => {
            renameCalendar(id, newName);
            setIsInputModalOpen(false);
        }
    });
    setIsInputModalOpen(true);
  };
  
  const handleDeleteCalendar = (id: string) => {
      if (window.confirm("¿Estás seguro? Se borrarán todos los turnos y datos de este calendario de forma permanente.")) {
          deleteCalendar(id);
      }
  };

  const ThemeButton: React.FC<{
    mode: 'light' | 'dark' | 'system';
    label: string;
    icon: React.ReactNode;
  }> = ({ mode, label, icon }) => (
    <button
      onClick={() => setTheme(mode)}
      className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-colors ${theme === mode ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
    >
      {icon}
      <span className="text-sm font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="p-2 space-y-6">
      {/* Sync Management */}
      <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Sincronización y Respaldo</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Guarda un código de respaldo para restaurar tus datos en cualquier dispositivo o navegador.</p>
            <button onClick={() => setIsSyncModalOpen(true)} className="bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full space-x-2 hover:bg-teal-700 transition-colors">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-lg font-semibold">Gestionar Respaldo Manual</span>
            </button>
          </div>
      </div>

      {/* Automatic Backups */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Respaldos Automáticos</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frecuencia de recordatorio</label>
            <select
                id="backup-frequency"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value as BackupFrequency)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            >
                <option value="disabled">Desactivado</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">La aplicación te recordará que hagas un respaldo al abrirla, según la frecuencia que elijas.</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Apariencia</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex justify-around space-x-2">
            <ThemeButton mode="light" label="Claro" icon={<Sun className="w-6 h-6" />} />
            <ThemeButton mode="dark" label="Oscuro" icon={<Moon className="w-6 h-6" />} />
            <ThemeButton mode="system" label="Sistema" icon={<Laptop className="w-6 h-6" />} />
          </div>
        </div>
      </div>

      {/* Calendar Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Calendarios</h2>
          <button onClick={handleAddCalendar} className="bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Añadir</span>
          </button>
        </div>
        <div className="space-y-3">
          {calendars.map(cal => (
            <div key={cal.id} className={`bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md ${cal.id === activeCalendar?.id ? 'ring-2 ring-cyan-500' : ''}`}>
              <p className="font-semibold text-lg">{cal.name}</p>
              <div className="flex space-x-2">
                <button onClick={() => handleRenameCalendar(cal.id, cal.name)} className="p-2 text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDeleteCalendar(cal.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors" disabled={calendars.length <= 1}>
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Gestionar Turnos</h2>
          <button onClick={handleAddNewShift} className="bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Añadir</span>
          </button>
        </div>
        <div className="space-y-3">
          {shifts.map(shift => (
            <div key={shift.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${shift.color} text-white`}>
                  {ICONS[shift.icon]}
                </div>
                <div>
                  <p className="font-semibold text-lg">{shift.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Abreviatura: {shift.abbreviation}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditShift(shift)} className="p-2 text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDeleteShift(shift.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {shifts.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 pt-8">No has creado ningún turno. ¡Añade uno para empezar!</p>
          )}
        </div>
      </div>
      
      {isSyncModalOpen && <SyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />}

      {isShiftModalOpen && (
        <ShiftFormModal
          isOpen={isShiftModalOpen}
          onClose={() => setIsShiftModalOpen(false)}
          shift={editingShift}
        />
      )}
      
      {isInputModalOpen && inputModalConfig && (
        <InputDialog
            isOpen={isInputModalOpen}
            onClose={() => setIsInputModalOpen(false)}
            title={inputModalConfig.title}
            label={inputModalConfig.label}
            initialValue={inputModalConfig.initialValue}
            onConfirm={inputModalConfig.onConfirm}
        />
      )}

      <div className="text-center mt-8 pb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          MisTurnos Versión 1.0.0
        </p>
      </div>
    </div>
  );
};

export default SettingsView;