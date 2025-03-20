const formatLargeNumber = (num: number): string => {
  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  }
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  }
  if (absNum >= 1e3) {
    return (num / 1e3).toFixed(3);
  }
  return num.toString();
};

export const formatCurrency = (
  value: number,
  shortenLargeNumbers: boolean = true
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (shortenLargeNumbers && Math.abs(value) >= 1000) {
    const symbol = formatter.formatToParts(value)[0].value; // Get currency symbol
    return symbol + formatLargeNumber(value);
  }

  return formatter.format(value);
};
