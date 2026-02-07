
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HistoryLog from './HistoryLog';
import { getHexColor } from '../utils/colorUtils';

type ViewMode = 'monthly' | 'annual';

const StatisticsView: React.FC = () => {
  const { activeCalendar, shifts, theme } = useAppContext();
  const assignedShifts = activeCalendar?.assignedShifts || {};

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');

  const shiftMap = useMemo(() => new Map(shifts.map(s => [s.id, s])), [shifts]);

  const handlePrev = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    }
  };
  
  const { monthlyStats, monthlyDaysWorked } = useMemo(() => {
    const counts: { [key: string]: number } = {};
    shifts.forEach(s => counts[s.id] = 0);
    let totalShifts = 0;

    Object.entries(assignedShifts).forEach(([dateStr, dayShifts]) => {
      const date = new Date(`${dateStr}T00:00:00`);
      if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        dayShifts.forEach(shiftId => {
          if (shiftId && counts[shiftId] !== undefined) {
            counts[shiftId]++;
            totalShifts++;
          }
        });
      }
    });
    const stats = shifts.map(s => ({ name: s.abbreviation, count: counts[s.id] }));
    return { monthlyStats: stats, monthlyDaysWorked: Math.floor(totalShifts / 3) };
  }, [currentDate, assignedShifts, shifts]);
  
  const { annualStats, annualDaysWorked } = useMemo(() => {
    const counts: { [key: string]: number } = {};
    shifts.forEach(s => counts[s.id] = 0);
    let totalShifts = 0;
    
    Object.entries(assignedShifts).forEach(([dateStr, dayShifts]) => {
      const date = new Date(`${dateStr}T00:00:00`);
      if (date.getFullYear() === currentDate.getFullYear()) {
        dayShifts.forEach(shiftId => {
          if (shiftId && counts[shiftId] !== undefined) {
            counts[shiftId]++;
            totalShifts++;
          }
        });
      }
    });
    return { annualStats: counts, annualDaysWorked: Math.floor(totalShifts / 3) };
  }, [currentDate, assignedShifts, shifts]);

  const monthlyShiftCombinations = useMemo(() => {
    const combinations: { [key: string]: number } = {};
    Object.entries(assignedShifts).forEach(([dateStr, dayShifts]) => {
        const date = new Date(`${dateStr}T00:00:00`);
        if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
            const key = dayShifts.filter(id => id !== null).map(id => shiftMap.get(id!)?.abbreviation || '?').join('/') || 'Día Libre';
            combinations[key] = (combinations[key] || 0) + 1;
        }
    });
    return Object.entries(combinations).sort((a, b) => b[1] - a[1]);
  }, [currentDate, assignedShifts, shiftMap]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const shift = shifts.find(s => s.abbreviation === label);
      return (
        <div className="bg-gray-700/80 dark:bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg text-white">
          <p className="font-bold">{shift?.name || label}</p>
          <p className="text-cyan-400">{`Total: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const axisColor = theme === 'dark' ? '#a0aec0' : '#4a5568';
  const gridColor = theme === 'dark' ? '#4a5568' : '#e2e8f0';

  const hasData = useMemo(() => {
    if (viewMode === 'monthly') {
      return monthlyStats.some(s => s.count > 0);
    }
    return Object.values(annualStats).some(count => count > 0);
  }, [viewMode, monthlyStats, annualStats]);

  const ToggleButton: React.FC<{ mode: ViewMode, label: string }> = ({ mode, label }) => (
    <button
      onClick={() => setViewMode(mode)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${viewMode === mode ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-2 space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-full">
            <ToggleButton mode="monthly" label="Mensual" />
            <ToggleButton mode="annual" label="Anual" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 capitalize text-center">
            {viewMode === 'monthly'
              ? currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
              : currentDate.getFullYear()
            }
          </h2>
          <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {hasData ? (
          viewMode === 'monthly' ? (
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <BarChart data={monthlyStats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={axisColor} />
                        <YAxis allowDecimals={false} stroke={axisColor} />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(107, 114, 128, 0.2)'}} />
                        <Bar dataKey="count" name="Total" barSize={30}>
                            {monthlyStats.map((entry, index) => {
                                const shift = shifts.find(s => s.abbreviation === entry.name);
                                return <Bar key={`cell-${index}`} fill={getHexColor(shift?.color || 'bg-gray-500')} />
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              {Object.entries(annualStats).map(([shiftId, count]) => {
                  const shift = shiftMap.get(shiftId);
                  if (!shift) return null;
                  return (
                      <div key={shiftId} className={`p-3 rounded-lg ${shift.color} text-white`}>
                          <p className="font-bold text-2xl">{count}</p>
                          <p className="text-sm font-semibold opacity-90">{shift.name}</p>
                      </div>
                  );
              })}
               <div className="p-3 rounded-lg bg-teal-600 text-white">
                  <p className="font-bold text-2xl">{annualDaysWorked}</p>
                  <p className="text-sm font-semibold opacity-90">Días Completos</p>
              </div>
            </div>
          )
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No hay datos de turnos para este período.</p>
          </div>
        )}
      </div>
      
      {viewMode === 'monthly' && (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
               <h3 className="text-lg font-semibold mb-2 text-cyan-600 dark:text-cyan-400">Días Completos</h3>
               <p className="text-5xl font-bold">{monthlyDaysWorked}</p>
               <p className="text-sm text-gray-500 dark:text-gray-400">(Mes)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2 text-center text-cyan-600 dark:text-cyan-400">Combinaciones</h3>
                <div className="max-h-24 overflow-y-auto pr-2 text-xs">
                    {monthlyShiftCombinations.length > 0 && monthlyShiftCombinations.some(c => c[1]>0) ? (
                      <table className="w-full text-left">
                          <tbody>
                              {monthlyShiftCombinations.map(([combo, count]) => (
                                  <tr key={combo} className="border-b border-gray-200 dark:border-gray-700">
                                      <td className="py-1 font-mono font-medium">{combo}</td>
                                      <td className="py-1 font-mono text-right">{count}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    ) : <p className="text-gray-500 text-center pt-4">Sin datos</p>}
                </div>
            </div>
        </div>
      )}
      
      <HistoryLog />
    </div>
  );
};

export default StatisticsView;
