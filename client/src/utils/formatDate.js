export const ALL_MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export function getTodayISODate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthYear() {
  const d = new Date();
  const monthName = ALL_MONTHS[d.getMonth()];
  return `${monthName} ${d.getFullYear()}`;
}

export function formatDateForDisplay(isoString) {
  if (!isoString) return '';
  // If already DD/MM/YYYY or contains text, return as is
  if (isoString.includes('/') || isoString.includes(' ')) return isoString;
  const parts = isoString.split('-');
  if (parts.length === 3) {
    // YYYY-MM-DD -> DD/MM/YYYY
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoString;
}

export function getMonthOptions() {
  const d = new Date();
  const currentYear = d.getFullYear();
  const options = [];

  // 12 months for current year and adjacent years
  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let m = 0; m < 12; m++) {
      options.push(`${ALL_MONTHS[m]} ${year}`);
    }
  }
  return options;
}
