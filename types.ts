
export interface Shift {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  icon: string;
}

export type AssignedShifts = {
  [date: string]: (string | null)[];
};

export type Page = 'calendar' | 'statistics' | 'settings';
