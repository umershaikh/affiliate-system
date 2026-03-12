export const formatCurrencyPKR = (value) => {
  const num = Number(value) || 0;

  // Use compact K / M formatting for very large numbers
  if (Math.abs(num) >= 1_000_000) {
    const millions = num / 1_000_000;
    return `${millions.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(num) >= 1_000) {
    const thousands = num / 1_000;
    return `${thousands.toFixed(1).replace(/\.0$/, '')}K`;
  }

  // For smaller numbers, use standard locale formatting with commas
  return num.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

