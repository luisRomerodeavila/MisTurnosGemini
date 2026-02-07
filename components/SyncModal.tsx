
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Copy, Check, UploadCloud } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose }) => {
    const { generateSyncCode, loadFromSyncCode } = useAppContext();
    const [syncCode, setSyncCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleGenerateCode = () => {
        const code = generateSyncCode();
        setSyncCode(code);
        setCopied(false);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(syncCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleLoadCode = () => {
        if (!inputCode.trim()) {
            alert("Por favor, pega un código de respaldo válido.");
            return;
        }
        if (window.confirm("¿Estás seguro? Esto reemplazará todos tus datos actuales con los del código de respaldo.")) {
            const success = loadFromSyncCode(inputCode);
            if (success) {
                alert("Datos restaurados con éxito.");
                onClose();
            } else {
                alert("El código no es válido o está corrupto. No se realizaron cambios.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-center">Sincronización y Respaldo</h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Generate and show code */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-cyan-600 dark:text-cyan-400">1. Guarda tu código de respaldo</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Genera un código y cópialo en un lugar seguro. Úsalo para restaurar tus datos más tarde.</p>
                        <button onClick={handleGenerateCode} className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                            Generar mi código
                        </button>
                        {syncCode && (
                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={syncCode}
                                    className="w-full h-24 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300 resize-none font-mono"
                                />
                                <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                                    {copied ? <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Load from code */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-cyan-600 dark:text-cyan-400">2. Carga desde un código</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pega un código de respaldo aquí para reemplazar tus datos actuales.</p>
                        <textarea
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Pega tu código de respaldo aquí..."
                            className="w-full h-24 p-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs resize-none focus:ring-cyan-500 focus:border-cyan-500"
                        />
                         <button onClick={handleLoadCode} className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-teal-700 transition-colors">
                            <UploadCloud className="w-5 h-5" />
                            <span>Cargar Datos</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SyncModal;