/**
 * Format store hours string to a readable format
 * Sometimes the API returns a weird timestamp like "0007-06-16 23:00:00.000000" instead of "9:00 AM - 5:00 PM".
 * This function handles both normal strings and those timestamp strings.
 */
export const formatStoreHours = (hours: string): string => {
  if (!hours) return '';
  
  // If it's already a regular timeframe like "9:00 AM - 5:00 PM", just return it
  if (hours.toLowerCase().includes('am') || hours.toLowerCase().includes('pm') || hours.includes('-')) {
    // If it looks like a full timestamp with a dash (e.g. 0007-06-16 23:00:00.000000), let's parse it
    if (hours.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/)) {
      // It's the weird timestamp format. Let's parse the time portion.
      const timePart = hours.split(' ')[1];
      if (timePart) {
        const [hourStr, minStr] = timePart.split(':');
        const h = parseInt(hourStr, 10);
        if (!isNaN(h)) {
          const ampm = h >= 12 ? 'PM' : 'AM';
          const formattedH = h % 12 || 12;
          return `${formattedH}:${minStr} ${ampm}`;
        }
      }
    }
    
    // Otherwise return as-is (e.g. normal string)
    if (!hours.match(/^\d{4}-\d{2}-\d{2}/)) {
      return hours;
    }
  }
  
  // Try to parse just the timestamp if it lacks am/pm/dash but matches the date pattern
  if (hours.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/)) {
    const timePart = hours.split(' ')[1];
    if (timePart) {
      const [hourStr, minStr] = timePart.split(':');
      const h = parseInt(hourStr, 10);
      if (!isNaN(h)) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12;
        return `${formattedH}:${minStr} ${ampm}`;
      }
    }
  }

  // Fallback
  return hours;
};
