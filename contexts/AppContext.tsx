
import React, { createContext, useContext } from 'react';
import { Shift, AssignedShifts } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_SHIFTS } from '../constants';

export interface HistoryEntry {
  id: number;
  date: string;
  description: string;
  type: 'add' | 'remove' | 'modify' | 'clear';
}

type Theme = 'light' | 'dark' | 'system';
export type BackupFrequency = 'disabled' | 'daily' | 'weekly' | 'monthly';

interface Calendar {
  id: string;
  name: string;
  assignedShifts: AssignedShifts;
  notes?: { [date: string]: string };
  alarms?: { [date: string]: { [shiftId: string]: string } };
  history?: HistoryEntry[];
}

interface AppState {
  calendars: Calendar[];
  activeCalendarId: string;
  shifts: Shift[];
  theme: Theme;
  backupFrequency: BackupFrequency;
  lastBackupPrompt?: string; // ISO string
}

interface AppContextType {
  calendars: Calendar[];
  activeCalendar: Calendar | undefined;
  shifts: Shift[];
  theme: Theme;
  backupFrequency: BackupFrequency;
  lastBackupPrompt?: string;
  setTheme: (theme: Theme) => void;
  switchCalendar: (calendarId: string) => void;
  addCalendar: (name: string) => void;
  renameCalendar: (id: string, newName: string) => void;
  deleteCalendar: (id: string) => void;
  
  updateShiftAssignment: (date: string, slotIndex: number, shiftId: string | null) => void;
  addShift: (shift: Shift) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (shiftId: string) => void;
  updateNote: (date: string, text: string | null) => void;
  clearMonthShifts: (year: number, month: number) => void;
  updateAlarm: (date: string, shiftId: string, time: string | null) => void;
  
  generateSyncCode: () => string;
  loadFromSyncCode: (code: string) => boolean;
  clearHistory: () => void;
  setBackupFrequency: (frequency: BackupFrequency) => void;
  updateLastBackupPrompt: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCalendarId = `calendar-${Date.now()}`;
const initialAppState: AppState = {
    calendars: [
        {
            id: initialCalendarId,
            name: 'Principal',
            assignedShifts: {},
            notes: {},
            alarms: {},
            history: [],
        }
    ],
    activeCalendarId: initialCalendarId,
    shifts: DEFAULT_SHIFTS,
    theme: 'system',
    backupFrequency: 'disabled',
};


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useLocalStorage<AppState>('misTurnosData', initialAppState);
  
  const activeCalendar = appState.calendars.find(c => c.id === appState.activeCalendarId);

  const setTheme = (theme: Theme) => {
    setAppState(prev => ({ ...prev, theme }));
  };
  
  const setBackupFrequency = (frequency: BackupFrequency) => {
    setAppState(prev => ({ ...prev, backupFrequency: frequency }));
  };
  
  const updateLastBackupPrompt = () => {
    setAppState(prev => ({ ...prev, lastBackupPrompt: new Date().toISOString() }));
  };

  const switchCalendar = (calendarId: string) => {
      setAppState(prev => ({ ...prev, activeCalendarId: calendarId }));
  };
  
  const addCalendar = (name: string) => {
      if(appState.calendars.length >= 10) {
          alert("Puedes tener un máximo de 10 calendarios.");
          return;
      }
      const newCalendar: Calendar = {
          id: `calendar-${Date.now()}`,
          name,
          assignedShifts: {},
          notes: {},
          alarms: {},
          history: [],
      };
      setAppState(prev => ({
          ...prev,
          calendars: [...prev.calendars, newCalendar],
          activeCalendarId: newCalendar.id
      }));
  };

  const renameCalendar = (id: string, newName: string) => {
      setAppState(prev => ({
          ...prev,
          calendars: prev.calendars.map(c => c.id === id ? {...c, name: newName} : c)
      }));
  };
  
  const deleteCalendar = (id: string) => {
      if (appState.calendars.length <= 1) {
          alert("Debes tener al menos un calendario.");
          return;
      }
      setAppState(prev => {
          const newCalendars = prev.calendars.filter(c => c.id !== id);
          const newActiveId = id === prev.activeCalendarId ? newCalendars[0].id : prev.activeCalendarId;
          return {
              ...prev,
              calendars: newCalendars,
              activeCalendarId: newActiveId
          };
      });
  };

  const updateShiftAssignment = (date: string, slotIndex: number, shiftId: string | null) => {
    setAppState(prev => {
        const shiftMap = new Map(prev.shifts.map(s => [s.id, s]));

        const newCalendars = prev.calendars.map(cal => {
            if (cal.id !== prev.activeCalendarId) {
                return cal;
            }
            
            const oldShiftId = cal.assignedShifts[date]?.[slotIndex] || null;
            const newShiftId = shiftId;
            let historyEntry: HistoryEntry | null = null;
            
            if (oldShiftId !== newShiftId) {
                const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                const oldShift = oldShiftId ? shiftMap.get(oldShiftId) : null;
                const newShift = newShiftId ? shiftMap.get(newShiftId) : null;
                let description = '';
                let type: HistoryEntry['type'] = 'modify';

                if (!oldShift && newShift) {
                    type = 'add';
                    description = `Añadido '${newShift.name}' el ${formattedDate}.`;
                } else if (oldShift && !newShift) {
                    type = 'remove';
                    description = `Quitado '${oldShift.name}' el ${formattedDate}.`;
                } else if (oldShift && newShift) {
                    type = 'modify';
                    description = `Cambiado '${oldShift.name}' por '${newShift.name}' el ${formattedDate}.`;
                }
                
                if (description) {
                    historyEntry = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        description,
                        type,
                    };
                }
            }

            const newAssignments = { ...cal.assignedShifts };
            let dayShifts = newAssignments[date] ? [...newAssignments[date]] : [null, null, null];
            while(dayShifts.length < 3) dayShifts.push(null);

            if (shiftId !== null) {
                const isAlreadyAssigned = dayShifts.some((existingShiftId, index) => {
                    return index !== slotIndex && existingShiftId === shiftId;
                });
                if (isAlreadyAssigned) return cal; 
            }
            
            dayShifts[slotIndex] = shiftId;

            const priority: { [key: string]: number } = { 'm': 1, 't': 2, 'n': 3 };
            const assignedDayShifts = dayShifts.filter(id => id !== null) as string[];
            assignedDayShifts.sort((a, b) => (priority[a] || 99) - (priority[b] || 99));
            
            const sortedDayShifts: (string | null)[] = [...assignedDayShifts];
            while (sortedDayShifts.length < 3) sortedDayShifts.push(null);

            if (sortedDayShifts.every(s => s === null)) {
                delete newAssignments[date];
            } else {
                newAssignments[date] = sortedDayShifts;
            }
            
            const newHistory = historyEntry ? [historyEntry, ...(cal.history || [])].slice(0, 100) : (cal.history || []);
            
            return { ...cal, assignedShifts: newAssignments, history: newHistory };
        });
        
        return { ...prev, calendars: newCalendars };
    });
  };
  
  const addShift = (shift: Shift) => {
    setAppState(prev => ({ ...prev, shifts: [...prev.shifts, shift] }));
  };
  
  const updateShift = (updatedShift: Shift) => {
    setAppState(prev => ({
        ...prev,
        shifts: prev.shifts.map(s => s.id === updatedShift.id ? updatedShift : s)
    }));
  };
  
  const deleteShift = (shiftId: string) => {
    setAppState(prev => {
        const newShifts = prev.shifts.filter(s => s.id !== shiftId);
        
        const newCalendars = prev.calendars.map(cal => {
            const newAssignments = { ...cal.assignedShifts };
            for (const date in newAssignments) {
                newAssignments[date] = newAssignments[date].map(s => s === shiftId ? null : s);
                if (newAssignments[date].every(s => s === null)) {
                    delete newAssignments[date];
                }
            }
            return { ...cal, assignedShifts: newAssignments };
        });

        return {
            ...prev,
            shifts: newShifts,
            calendars: newCalendars,
        };
    });
  };
  
  const updateNote = (date: string, text: string | null) => {
      setAppState(prev => {
          const newCalendars = prev.calendars.map(cal => {
              if (cal.id !== prev.activeCalendarId) {
                  return cal;
              }
              const newNotes = { ...(cal.notes || {}) };
              if (text && text.trim().length > 0) {
                  newNotes[date] = text;
              } else {
                  delete newNotes[date];
              }
              return { ...cal, notes: newNotes };
          });
          return { ...prev, calendars: newCalendars };
      });
  };
  
  const clearMonthShifts = (year: number, month: number) => {
      setAppState(prev => {
          const newCalendars = prev.calendars.map(cal => {
              if (cal.id !== prev.activeCalendarId) {
                  return cal;
              }

              const newAssignments = Object.fromEntries(
                Object.entries(cal.assignedShifts).filter(([dateStr]) => {
                    const date = new Date(`${dateStr}T00:00:00`);
                    return date.getFullYear() !== year || date.getMonth() !== month;
                })
              );
              
              const monthDate = new Date(year, month, 1);
              const monthName = monthDate.toLocaleString('es-ES', { month: 'long' });
              const historyEntry: HistoryEntry = {
                  id: Date.now(),
                  date: new Date().toISOString(),
                  description: `Borrados todos los turnos de ${monthName} ${year}.`,
                  type: 'clear',
              };
              const newHistory = [historyEntry, ...(cal.history || [])].slice(0, 100);

              return { ...cal, assignedShifts: newAssignments, history: newHistory };
          });
          return { ...prev, calendars: newCalendars };
      });
  };

  const updateAlarm = (date: string, shiftId: string, time: string | null) => {
    setAppState(prev => {
        const newCalendars = prev.calendars.map(cal => {
            if (cal.id !== prev.activeCalendarId) {
                return cal;
            }

            const newAlarms = JSON.parse(JSON.stringify(cal.alarms || {}));

            if (time) {
                if (!newAlarms[date]) {
                    newAlarms[date] = {};
                }
                newAlarms[date][shiftId] = time;
            } else {
                if (newAlarms[date] && newAlarms[date][shiftId]) {
                    delete newAlarms[date][shiftId];
                    if (Object.keys(newAlarms[date]).length === 0) {
                        delete newAlarms[date];
                    }
                }
            }
            return { ...cal, alarms: newAlarms };
        });
        return { ...prev, calendars: newCalendars };
    });
  };
  
  const generateSyncCode = () => {
      const stateString = JSON.stringify(appState);
      return btoa(stateString);
  };

  const loadFromSyncCode = (code: string): boolean => {
      try {
          const stateString = atob(code);
          const newState = JSON.parse(stateString) as AppState;
          if (newState && newState.calendars && newState.activeCalendarId && newState.shifts) {
              // Keep existing backup settings
              newState.backupFrequency = appState.backupFrequency || 'disabled';
              newState.lastBackupPrompt = appState.lastBackupPrompt;
              setAppState(newState);
              return true;
          }
          return false;
      } catch (error) {
          console.error("Failed to load from sync code:", error);
          return false;
      }
  };

  const clearHistory = () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar todo el historial de cambios de este calendario?")) return;
    setAppState(prev => {
        const activeCal = prev.calendars.find(c => c.id === prev.activeCalendarId);
        if (!activeCal?.history?.length) {
            return prev;
        }

        const newCalendars = prev.calendars.map(cal => {
            if (cal.id === prev.activeCalendarId) {
                return { ...cal, history: [] };
            }
            return cal;
        });
        
        return { ...prev, calendars: newCalendars };
    });
  };

  return (
    <AppContext.Provider value={{ calendars: appState.calendars, activeCalendar, shifts: appState.shifts, theme: appState.theme, backupFrequency: appState.backupFrequency, lastBackupPrompt: appState.lastBackupPrompt, setTheme, switchCalendar, addCalendar, renameCalendar, deleteCalendar, updateShiftAssignment, addShift, updateShift, deleteShift, updateNote, clearMonthShifts, updateAlarm, generateSyncCode, loadFromSyncCode, clearHistory, setBackupFrequency, updateLastBackupPrompt }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
