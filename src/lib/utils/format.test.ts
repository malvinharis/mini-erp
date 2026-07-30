import { formatCurrency, formatDate } from './format';

describe('format utils', () => {
  it('formatCurrency formats numbers as USD', () => {
    expect(formatCurrency(1250.5)).toBe('$1,250.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formatCurrency accepts numeric strings', () => {
    expect(formatCurrency('42')).toBe('$42.00');
  });

  it('formatDate includes the year', () => {
    expect(formatDate('2026-07-30T00:00:00.000Z')).toMatch(/2026/);
  });
});
