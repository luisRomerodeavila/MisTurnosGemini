

import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import CalendarView from './components/CalendarView';
import StatisticsView from './components/StatisticsView';
import SettingsView from './components/SettingsView';
import { Page } from './types';
import CalendarSwitcher from './components/CalendarSwitcher';
import { useAppContext } from './contexts/AppContext';
import { formatToYYYYMMDD } from './utils/dateUtils';
import { getHexColor } from './utils/colorUtils';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('calendar');
  const { 
      activeCalendar, 
      shifts, 
      theme, 
      backupFrequency, 
      lastBackupPrompt, 
      updateLastBackupPrompt, 
      generateSyncCode 
  } = useAppContext();
  const shiftMap = useMemo(() => new Map(shifts.map(s => [s.id, s])), [shifts]);

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    const applyTheme = (isDark: boolean) => {
        if (isDark) {
            root.classList.add('dark');
            metaThemeColor?.setAttribute('content', '#111827');
        } else {
            root.classList.remove('dark');
            metaThemeColor?.setAttribute('content', '#ffffff');
        }
    };

    if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        applyTheme(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
        applyTheme(theme === 'dark');
    }
  }, [theme]);


  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleShareBackup = async () => {
    const code = generateSyncCode();
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const fileName = `MisTurnos_Respaldo_${dateString}.txt`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: 'text/plain' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: 'Respaldo de MisTurnos',
                text: `Respaldo de datos de MisTurnos del ${date.toLocaleDateString()}.`,
                files: [file],
            });
        } catch (error) {
            console.error('Error al compartir el respaldo:', error);
            alert('No se pudo compartir el archivo. Puedes generar un respaldo manual desde Ajustes.');
        }
    } else {
        // Fallback for browsers that don't support sharing files
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }
  };

  useEffect(() => {
    if (backupFrequency === 'disabled' || !activeCalendar) return;

    const now = new Date();
    const lastPrompt = lastBackupPrompt ? new Date(lastBackupPrompt) : new Date(0);
    const timeSinceLastPrompt = now.getTime() - lastPrompt.getTime();

    let requiredInterval = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    
    switch (backupFrequency) {
        case 'daily': requiredInterval = oneDay; break;
        case 'weekly': requiredInterval = 7 * oneDay; break;
        case 'monthly': requiredInterval = 30 * oneDay; break;
        default: break;
    }

    if (timeSinceLastPrompt > requiredInterval) {
        // Delay prompt slightly to not be jarring on app open
        setTimeout(() => {
            if (window.confirm("Es hora de hacer un respaldo. ¿Quieres crear uno ahora?")) {
                handleShareBackup();
            }
            // Update prompt time even if user cancels, to avoid asking again on next open
            updateLastBackupPrompt();
        }, 1000);
    }
  }, [activeCalendar, backupFrequency, lastBackupPrompt]);


  const createNotificationIcon = (tailwindColor: string): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const hexColor = getHexColor(tailwindColor);
    
    ctx.fillStyle = hexColor;
    ctx.beginPath();
    ctx.arc(96, 96, 80, 0, 2 * Math.PI);
    ctx.fill();

    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    if (!activeCalendar?.alarms) return;

    const checkAlarms = () => {
        const now = new Date();
        const todayKey = formatToYYYYMMDD(now);
        const todaysAlarms = activeCalendar.alarms?.[todayKey];

        if (todaysAlarms) {
            for (const shiftId in todaysAlarms) {
                const shiftStartTimeString = todaysAlarms[shiftId];
                if (!shiftStartTimeString) continue;

                const [hours, minutes] = shiftStartTimeString.split(':').map(Number);
                const shiftStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

                // Calculate notification time (15 minutes before start time)
                const notificationTime = new Date(shiftStartDate.getTime() - 15 * 60 * 1000);

                // Check if it's time to notify
                if (notificationTime.getFullYear() === now.getFullYear() &&
                    notificationTime.getMonth() === now.getMonth() &&
                    notificationTime.getDate() === now.getDate() &&
                    notificationTime.getHours() === now.getHours() &&
                    notificationTime.getMinutes() === now.getMinutes()) {
                    
                    const shift = shiftMap.get(shiftId);
                    if (shift && Notification.permission === 'granted') {
                        const icon = createNotificationIcon(shift.color);
                        new Notification('Recordatorio de Turno', {
                            body: `Tu turno "${shift.name}" comienza en 15 minutos, a las ${shiftStartTimeString}.`,
                            icon: icon,
                            // FIX: Use `todayKey` which is defined in this scope, instead of the undefined `dateKey`.
                            tag: `shift-notification-${todayKey}-${shiftId}` // Prevent duplicate notifications
                        });
                    }
                }
            }
        }
    };

    const intervalId = setInterval(checkAlarms, 60000); // Check every minute

    return () => {
        clearInterval(intervalId);
    };
  }, [activeCalendar, shiftMap]);


  const renderPage = () => {
    switch (activePage) {
      case 'calendar':
        return <CalendarView />;
      case 'statistics':
        return <StatisticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md p-2 sm:p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex-1">
             <h1 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 tracking-wider text-center">MisTurnos</h1>
        </div>
        <div className="absolute right-2 sm:right-4">
            <CalendarSwitcher />
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-2 sm:p-4">
        {renderPage()}
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default App;