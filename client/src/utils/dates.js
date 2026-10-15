import { addDays, format } from 'date-fns';

export const parseDay = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toApiDate = (date) => format(date, 'yyyy-MM-dd');

export const prettyDate = (iso) => format(parseDay(iso), 'dd MMM yyyy');

export const lastNight = (checkOutIso) => addDays(parseDay(checkOutIso), -1);