export function getWeeklyPayment(price: number): number | null {
  if (!price || price <= 0) return null;
  // Approx 12% total cost over 2yr / 104 weeks
  return Math.round((price * 1.12) / 104);
}
