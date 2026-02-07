
import React, { useState, useEffect } from 'react';

interface InputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  label: string;
  initialValue?: string;
}

const InputDialog: React.FC<InputDialogProps> = ({ isOpen, onClose, onConfirm, title, label, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="dialog-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input
              type="text"
              id="dialog-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 text-white transition-colors">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputDialog;