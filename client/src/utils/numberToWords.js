/**
 * Converts a numeric amount to English words (Indian numbering system: Lakhs, Crores, Thousands, Hundreds)
 * e.g., 7500 -> "SEVEN THOUSAND FIVE HUNDRED ONLY"
 */
export function numberToWords(amount) {
  if (amount === undefined || amount === null || amount === '') return '';

  const num = Math.floor(Math.abs(Number(amount)));
  if (isNaN(num)) return '';
  if (num === 0) return 'ZERO ONLY';

  const units = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
    'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
    'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ];

  const tens = [
    '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
  ];

  function convertTwoDigits(n) {
    if (n < 20) return units[n];
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    return `${tens[ten]}${unit ? ' ' + units[unit] : ''}`.trim();
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred > 0) {
      str += `${units[hundred]} HUNDRED`;
    }
    if (rest > 0) {
      str += (str ? ' ' : '') + convertTwoDigits(rest);
    }
    return str.trim();
  }

  let words = '';

  const crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const hundredAndRest = remainder;

  if (crore > 0) {
    words += `${convertThreeDigits(crore)} CRORE `;
  }
  if (lakh > 0) {
    words += `${convertThreeDigits(lakh)} LAKH `;
  }
  if (thousand > 0) {
    words += `${convertThreeDigits(thousand)} THOUSAND `;
  }
  if (hundredAndRest > 0) {
    words += `${convertThreeDigits(hundredAndRest)} `;
  }

  const result = words.trim() + ' ONLY';
  return result.replace(/\s+/g, ' ');
}

