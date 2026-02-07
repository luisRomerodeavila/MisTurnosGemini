
export const getDaysInMonth = (date: Date): Date[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  const dayOfWeek = (startDate.getDay() + 6) % 7; // Monday is 0, Sunday is 6
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  for (let i = 0; i < 42; i++) { // 6 weeks for full coverage
    currentWeek.push(new Date(startDate));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  
  // Ensure we don't show a 6th week if it's entirely in the next month
  const lastWeek = weeks[weeks.length - 1];
  if (lastWeek && lastWeek.every(d => d.getMonth() !== month)) {
      weeks.pop();
  }

  return weeks;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const formatToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
