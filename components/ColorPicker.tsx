
import React from 'react';
import { AVAILABLE_COLORS } from '../constants.tsx';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
      <div className="grid grid-cols-8 sm:grid-cols-11 gap-2">
        {AVAILABLE_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full transition-transform duration-150 ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-cyan-400 scale-110' : 'hover:scale-110'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;