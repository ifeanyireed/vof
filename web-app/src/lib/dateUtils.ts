/**
 * Date formatting utilities for Admin and User views.
 */

export interface FormattedDate {
  date: string;
  time: string;
  full: string;
}

/**
 * Safely formats any date-like input (ISO string, timestamp, Date instance)
 * into a clean, human-readable date and time badge.
 * Gracefully handles null, undefined, and malformed strings.
 */
export function formatApplicationDate(dateInput?: string | Date | null): FormattedDate {
  if (!dateInput) {
    return { date: '—', time: '', full: '—' };
  }

  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return { date: '—', time: '', full: '—' };
    }

    const date = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      date,
      time,
      full: `${date} at ${time}`,
    };
  } catch {
    return { date: '—', time: '', full: '—' };
  }
}
