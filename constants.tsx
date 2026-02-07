
import React from 'react';
import { Shift } from './types';
import { Sun, Cloud, Moon, Coffee, Briefcase, Bed, Zap, Star, Heart, BookOpen, PlusCircle } from 'lucide-react';

export const DEFAULT_SHIFTS: Shift[] = [
  { id: 'm', name: 'Mañana', abbreviation: 'M', color: 'bg-sky-500', icon: 'Sun' },
  { id: 't', name: 'Tarde', abbreviation: 'T', color: 'bg-amber-500', icon: 'Cloud' },
  { id: 'n', name: 'Noche', abbreviation: 'N', color: 'bg-indigo-600', icon: 'Moon' },
];

export const AVAILABLE_COLORS = [
    'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500', 'bg-rose-500'
];

export const ICONS: { [key: string]: React.ReactNode } = {
    Sun: <Sun className="w-5 h-5" />,
    Cloud: <Cloud className="w-5 h-5" />,
    Moon: <Moon className="w-5 h-5" />,
    Coffee: <Coffee className="w-5 h-5" />,
    Briefcase: <Briefcase className="w-5 h-5" />,
    Bed: <Bed className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Star: <Star className="w-5 h-5" />,
    Heart: <Heart className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    PlusCircle: <PlusCircle className="w-5 h-5" />
};
