
import React from 'react';
import { FileImage, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJPG: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExportJPG, onExportPDF, isExporting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-center">Exportar Calendario</h3>
        </div>
        
        <div className="p-6 space-y-4">
            <button
                onClick={onExportJPG}
                disabled={isExporting}
                className="w-full flex items-center justify-center p-4 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                <FileImage className="w-5 h-5 mr-3" />
                <span>{isExporting ? 'Exportando...' : 'Exportar como JPG'}</span>
            </button>
             <button
                onClick={onExportPDF}
                disabled={isExporting}
                className="w-full flex items-center justify-center p-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                <FileText className="w-5 h-5 mr-3" />
                <span>{isExporting ? 'Exportando...' : 'Exportar como PDF'}</span>
            </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button
                onClick={onClose}
                disabled={isExporting}
                className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
                Cancelar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;