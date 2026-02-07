
import React, { useState, useMemo, useRef } from 'react';
import { getDaysInMonth, isToday, formatToYYYYMMDD } from '../utils/dateUtils';
import { useAppContext } from '../contexts/AppContext';
import { Shift } from '../types';
import ShiftModal from './ShiftModal';
import NoteModal from './NoteModal';
import AlarmModal from './AlarmModal';
import PaintBar from './PaintBar';
import ExportModal from './ExportModal';
import ExportView from './ExportView';
import { ChevronLeft, ChevronRight, Brush, Trash2, Bell, Share2 } from 'lucide-react';

declare var html2canvas: any;
declare var jspdf: any;

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ date: Date, slotIndex: number } | null>(null);
  const [editingNoteForDate, setEditingNoteForDate] = useState<Date | null>(null);
  const [editingAlarmFor, setEditingAlarmFor] = useState<{ date: Date; shift: Shift } | null>(null);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [selectedPaintShiftId, setSelectedPaintShiftId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const exportRef = useRef<HTMLDivElement>(null);

  const { activeCalendar, updateShiftAssignment, shifts, clearMonthShifts } = useAppContext();
  const assignedShifts = activeCalendar?.assignedShifts || {};
  const notes = activeCalendar?.notes || {};
  const alarms = activeCalendar?.alarms || {};

  const weeks = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const shiftMap = useMemo(() => new Map(shifts.map(s => [s.id, s])), [shifts]);
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSlotClick = (date: Date, slotIndex: number) => {
    if (isPaintMode) {
      if (selectedPaintShiftId === undefined) return;
      const dateKey = formatToYYYYMMDD(date);
      updateShiftAssignment(dateKey, slotIndex, selectedPaintShiftId);
    } else {
      setSelectedDay({ date, slotIndex });
    }
  };
  
  const handleDayHeaderClick = (date: Date) => {
      setEditingNoteForDate(date);
  };
  
  const handleClearMonth = () => {
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();
    if (window.confirm(`¿Estás seguro de que quieres borrar todos los turnos de ${monthName} de ${year}? Esta acción no se puede deshacer.`)) {
        clearMonthShifts(currentDate.getFullYear(), currentDate.getMonth());
    }
  };

  const generateExport = async (format: 'jpg' | 'pdf') => {
      if (!exportRef.current) return;
      setIsExporting(true);
      
      const canvas = await html2canvas(exportRef.current, { scale: 2 });
      const filename = `MisTurnos_${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

      if (format === 'jpg') {
          const image = canvas.toDataURL('image/jpeg', 0.9);
          const link = document.createElement('a');
          link.href = image;
          link.download = `${filename}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jspdf.jsPDF({
              orientation: 'landscape',
              unit: 'px',
              format: [canvas.width, canvas.height]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`${filename}.pdf`);
      }

      setIsExporting(false);
      setIsExportModalOpen(false);
  };

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold capitalize text-center">
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-1 sm:space-x-2">
            <button onClick={() => setIsExportModalOpen(true)} title="Exportar / Compartir" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
            <button onClick={handleClearMonth} title="Limpiar Mes" className="p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={() => setIsPaintMode(p => !p)} title="Modo Pintar" className={`p-2 rounded-full transition-colors ${isPaintMode ? 'bg-cyan-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <Brush className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 grid-rows-5 gap-1 flex-grow">
        {weeks.flat().map((day, index) => {
          const dateKey = formatToYYYYMMDD(day);
          const dayShifts = assignedShifts[dateKey] || [null, null, null];
          const hasNote = !!notes[dateKey];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isTodaysDate = isToday(day);

          return (
            <div
              key={index}
              className={`flex flex-col rounded-lg overflow-hidden shadow-sm ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-200/50 dark:bg-gray-800/50'}`}
            >
              <button
                onClick={() => handleDayHeaderClick(day)}
                className={`relative text-center py-1 text-xs transition-colors ${isTodaysDate ? 'bg-cyan-500 text-white dark:text-gray-900 font-bold rounded-t-lg' : isCurrentMonth ? 'text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-500'}`}
                disabled={!isCurrentMonth}
              >
                {day.getDate()}
                {hasNote && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>}
              </button>
              <div className="flex-grow flex flex-col justify-around">
                {[0, 1, 2].map(slotIndex => {
                  const shiftId = dayShifts[slotIndex];
                  const shift = shiftId ? shiftMap.get(shiftId) : null;
                  const alarmTime = shift ? alarms[dateKey]?.[shift.id] : null;

                  return (
                    <div key={slotIndex} className="relative h-1/3 w-full">
                        <button
                            onClick={() => handleSlotClick(day, slotIndex)}
                            className={`w-full h-full flex items-center justify-center text-xs font-bold transition-opacity duration-200 ${isCurrentMonth ? isPaintMode ? 'cursor-copy' : 'hover:opacity-70' : 'cursor-not-allowed'} ${shift ? shift.color : ''}`}
                            disabled={!isCurrentMonth}
                        >
                            {shift ? (
                                <span className="text-white" title={shift.name}>{shift.abbreviation}</span>
                            ) : (
                                <span className="text-gray-400 dark:text-gray-600">.</span>
                            )}
                        </button>
                        {shift && isCurrentMonth && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setEditingAlarmFor({ date: day, shift }); }}
                                className={`absolute bottom-0.5 right-0.5 p-0.5 rounded-full transition-colors bg-black/30 ${alarmTime ? 'text-yellow-400' : 'text-white/50 hover:text-white'}`}
                                title={alarmTime ? `Alarma: ${alarmTime}` : 'Añadir Alarma'}
                            >
                                <Bell className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isPaintMode && (
          <PaintBar 
              shifts={shifts}
              selectedShiftId={selectedPaintShiftId}
              onSelectShift={setSelectedPaintShiftId}
          />
      )}

      {selectedDay && (
        <ShiftModal
          isOpen={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          date={selectedDay.date}
          slotIndex={selectedDay.slotIndex}
        />
      )}

      {editingNoteForDate && (
          <NoteModal
            isOpen={!!editingNoteForDate}
            onClose={() => setEditingNoteForDate(null)}
            date={editingNoteForDate}
          />
      )}

      {editingAlarmFor && (
        <AlarmModal
          isOpen={!!editingAlarmFor}
          onClose={() => setEditingAlarmFor(null)}
          date={editingAlarmFor.date}
          shift={editingAlarmFor.shift}
        />
      )}
      
      {isExportModalOpen && (
          <>
            <ExportModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExportJPG={() => generateExport('jpg')}
                onExportPDF={() => generateExport('pdf')}
                isExporting={isExporting}
            />
            <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
                <ExportView 
                    ref={exportRef}
                    currentDate={currentDate}
                    shifts={shifts}
                    assignedShifts={assignedShifts}
                />
            </div>
          </>
      )}
    </div>
  );
};

export default CalendarView;