
import React, { forwardRef } from 'react';
import { Shift, AssignedShifts } from '../types';
import { getDaysInMonth, formatToYYYYMMDD } from '../utils/dateUtils';

interface ExportViewProps {
  currentDate: Date;
  shifts: Shift[];
  assignedShifts: AssignedShifts;
}

const ExportView = forwardRef<HTMLDivElement, ExportViewProps>(({ currentDate, shifts, assignedShifts }, ref) => {
  const weeks = getDaysInMonth(currentDate);
  const shiftMap = new Map(shifts.map(s => [s.id, s]));
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div ref={ref} className="bg-white text-black p-8" style={{ width: '1123px', height: '794px' }}>
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">
        {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
      </h1>
      
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center font-bold pb-2 border-b-2 border-gray-300">{day}</div>
        ))}
        {weeks.flat().map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const dateKey = formatToYYYYMMDD(day);
          const dayShifts = assignedShifts[dateKey] || [null, null, null];
          
          return (
            <div
              key={index}
              className={`border border-gray-200 h-24 flex flex-col ${isCurrentMonth ? '' : 'bg-gray-100'}`}
            >
              <div className={`text-right p-1 text-sm ${isCurrentMonth ? 'font-semibold' : 'text-gray-400'}`}>
                {day.getDate()}
              </div>
              {isCurrentMonth && (
                <div className="flex-grow flex flex-col justify-end p-1 space-y-0.5">
                  {dayShifts.map((shiftId, slotIndex) => {
                    const shift = shiftId ? shiftMap.get(shiftId) : null;
                    if (!shift) return <div key={slotIndex} className="h-4" />;
                    return (
                      <div key={slotIndex} className={`text-white text-xs font-bold rounded-sm px-1.5 py-0.5 text-center ${shift.color}`}>
                        {shift.abbreviation}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-gray-300">
        <h2 className="text-xl font-bold mb-3">Leyenda</h2>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          {shifts.map(shift => (
            <div key={shift.id} className="flex items-center">
              <div className={`w-5 h-5 rounded-sm mr-3 ${shift.color}`}></div>
              <span className="font-semibold">{shift.abbreviation}:</span>
              <span className="ml-2">{shift.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ExportView;
