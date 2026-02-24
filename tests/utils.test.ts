import { describe, it, expect } from 'vitest';
import {
  formatDateISO,
  parseDate,
  isValidDateRange,
  getDaysBetween,
  getDefaultStartDate,
  getDefaultEndDate,
  getDateRange,
  isValidRepositoryFormat,
  isValidDateFormat,
  validateQueryOptions,
} from '../src/utils';

describe('formatDateISO', () => {
  it('formats a Date to YYYY-MM-DD', () => {
    const d = new Date('2024-03-15T12:00:00Z');
    expect(formatDateISO(d)).toBe('2024-03-15');
  });
});

describe('parseDate', () => {
  it('parses a valid date string', () => {
    const d = parseDate('2024-01-01');
    expect(d.getUTCFullYear()).toBe(2024);
    expect(d.getUTCMonth()).toBe(0);
    expect(d.getUTCDate()).toBe(1);
  });

  it('throws on invalid date', () => {
    expect(() => parseDate('not-a-date')).toThrow('Invalid date');
  });
});

describe('isValidDateRange', () => {
  it('returns true for valid range', () => {
    expect(isValidDateRange('2024-01-01', '2024-12-31')).toBe(true);
  });

  it('returns true for same date', () => {
    expect(isValidDateRange('2024-06-15', '2024-06-15')).toBe(true);
  });

  it('returns false for inverted range', () => {
    expect(isValidDateRange('2024-12-31', '2024-01-01')).toBe(false);
  });
});

describe('getDaysBetween', () => {
  it('calculates days between two dates', () => {
    expect(getDaysBetween('2024-01-01', '2024-01-10')).toBe(9);
  });

  it('returns 0 for same date', () => {
    expect(getDaysBetween('2024-06-15', '2024-06-15')).toBe(0);
  });
});

describe('getDefaultStartDate / getDefaultEndDate', () => {
  it('returns ISO date strings', () => {
    expect(getDefaultStartDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getDefaultEndDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('start is before end', () => {
    expect(isValidDateRange(getDefaultStartDate(), getDefaultEndDate())).toBe(true);
  });
});

describe('getDateRange', () => {
  it('generates an inclusive range of dates', () => {
    const range = getDateRange('2024-01-01', '2024-01-03');
    expect(range).toEqual(['2024-01-01', '2024-01-02', '2024-01-03']);
  });

  it('returns single date when start equals end', () => {
    const range = getDateRange('2024-06-15', '2024-06-15');
    expect(range).toEqual(['2024-06-15']);
  });
});

describe('isValidRepositoryFormat', () => {
  it('accepts valid owner/repo', () => {
    expect(isValidRepositoryFormat('owner/repo')).toBe(true);
    expect(isValidRepositoryFormat('my-org/my.project')).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(isValidRepositoryFormat('repo-only')).toBe(false);
    expect(isValidRepositoryFormat('')).toBe(false);
    expect(isValidRepositoryFormat('a/b/c')).toBe(false);
  });
});

describe('isValidDateFormat', () => {
  it('accepts YYYY-MM-DD format', () => {
    expect(isValidDateFormat('2024-01-15')).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(isValidDateFormat('2024/01/15')).toBe(false);
    expect(isValidDateFormat('Jan 15 2024')).toBe(false);
  });
});

describe('validateQueryOptions', () => {
  it('passes for valid options', () => {
    expect(() =>
      validateQueryOptions({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }),
    ).not.toThrow();
  });

  it('throws if dates missing', () => {
    expect(() =>
      validateQueryOptions({ startDate: '', endDate: '2024-12-31' }),
    ).toThrow('startDate and endDate are required');
  });

  it('throws if range inverted', () => {
    expect(() =>
      validateQueryOptions({ startDate: '2024-12-31', endDate: '2024-01-01' }),
    ).toThrow('startDate must be before endDate');
  });

  it('throws for invalid repository format', () => {
    expect(() =>
      validateQueryOptions({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        repository: 'bad',
      }),
    ).toThrow('owner/repo');
  });
});
