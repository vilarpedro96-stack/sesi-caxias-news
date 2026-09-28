export function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
    return new Date(y, m, d);
  }
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function daysUntilEvent(dateStr: string, now: Date = new Date()): number | null {
  const eventDay = parseLocalDate(dateStr);
  if (!eventDay) return null;
  const today = startOfDay(now);
  eventDay.setHours(0, 0, 0, 0);
  return Math.round((eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isEventEnded(
  dateStr: string,
  status?: string,
  now: Date = new Date(),
  endDateStr?: string
): boolean {
  if (status === 'encerrado') return true;
  const lastDay = parseLocalDate(endDateStr || dateStr);
  if (!lastDay) return false;
  lastDay.setHours(23, 59, 59, 999);
  return lastDay < now;
}

export function getEventCountdown(
  dateStr: string,
  now: Date = new Date(),
  endDateStr?: string
) {
  if (isEventEnded(dateStr, undefined, now, endDateStr)) {
    return {
      label: 'Encerrado',
      class:
        'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
    };
  }

  const diffDays = daysUntilEvent(dateStr, now);
  if (diffDays === null) return null;

  if (diffDays <= 0) {
    return {
      label: 'Hoje',
      class: 'bg-red-600 text-white font-black animate-pulse shadow-sm shadow-red-600/40'
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Amanhã',
      class: 'bg-amber-500 text-white font-bold shadow-sm'
    };
  }

  return {
    label: `Faltam ${diffDays} dias`,
    class: 'bg-emerald-600 text-white font-bold shadow-sm'
  };
}
