/**
 * Date Utility Functions
 * Date manipulation and calculations
 */

export const dateUtils = {
  now: (): Date => new Date(),

  today: (): Date => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },

  tomorrow: (): Date => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  yesterday: (): Date => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addHours: (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  },

  addMinutes: (date: Date, minutes: number): Date => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  },

  startOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  endOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  startOfYear: (date: Date): Date => {
    return new Date(date.getFullYear(), 0, 1);
  },

  endOfYear: (date: Date): Date => {
    return new Date(date.getFullYear(), 11, 31);
  },

  isSameDay: (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  isBefore: (date1: Date, date2: Date): boolean => {
    return date1.getTime() < date2.getTime();
  },

  isAfter: (date1: Date, date2: Date): boolean => {
    return date1.getTime() > date2.getTime();
  },

  isBetween: (date: Date, from: Date, to: Date): boolean => {
    return date.getTime() >= from.getTime() && date.getTime() <= to.getTime();
  },

  daysBetween: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  hoursBetween: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
  },

  toISOString: (date: Date): string => {
    return date.toISOString();
  },

  fromISOString: (isoString: string): Date => {
    return new Date(isoString);
  },

  toDateString: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  getMonthName: (month: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[month];
  },

  getDayName: (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  },

  last12Months: (): { from: Date; to: Date } => {
    const to = dateUtils.now();
    const from = dateUtils.addDays(to, -365);
    return { from, to };
  },

  thisMonth: (): { from: Date; to: Date } => {
    const from = dateUtils.startOfMonth(dateUtils.now());
    const to = dateUtils.endOfMonth(dateUtils.now());
    return { from, to };
  },

  thisYear: (): { from: Date; to: Date } => {
    const from = dateUtils.startOfYear(dateUtils.now());
    const to = dateUtils.endOfYear(dateUtils.now());
    return { from, to };
  },
};
