/**
 * Formats absolute INR numbers into concise Indian currency string (₹ Cr / ₹ Lakh / ₹ K)
 */
export function formatINR(amount?: number | null, fullFormat: boolean = false): string {
  if (amount === undefined || amount === null) {
    return "N/A";
  }

  if (fullFormat) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, '')} Cr`;
  }
  if (abs >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, '')} Lakh`;
  }
  if (abs >= 1000) {
    const k = amount / 1000;
    return `₹${k.toFixed(1)} K`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

export function parseINR(value: string | number): number | undefined {
  if (typeof value === 'number') return isNaN(value) ? undefined : value;
  if (!value) return undefined;
  const cleaned = value.toString().replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? undefined : parsed;
}
