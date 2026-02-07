
import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { HistoryEntry } from '../types.ts';
import { PlusCircle, MinusCircle, RefreshCw, Trash2, Clock } from 'lucide-react';

const ICONS_MAP: { [key in HistoryEntry['type']]: React.ReactNode } = {
    add: <PlusCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
    remove: <MinusCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
    modify: <RefreshCw className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
    clear: <Trash2 className="w-5 h-5 text-orange-500 dark:text-orange-400" />,
};

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return 'justo ahora';
};

const HistoryLog: React.FC = () => {
    const { activeCalendar, clearHistory } = useAppContext();
    const history = activeCalendar?.history || [];

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Historial de Cambios</h3>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-400 flex items-center space-x-1">
                        <Trash2 className="w-4 h-4" />
                        <span>Limpiar</span>
                    </button>
                )}
            </div>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                {history.length === 0 ? (
                    <p className="text-center text-gray-500 pt-8">No hay cambios registrados.</p>
                ) : (
                    history.map(entry => (
                        <div key={entry.id} className="flex items-start space-x-3">
                            <div className="mt-1">{ICONS_MAP[entry.type]}</div>
                            <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">{entry.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Clock className="w-3 h-3 mr-1.5" />
                                    {timeAgo(entry.date)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryLog;