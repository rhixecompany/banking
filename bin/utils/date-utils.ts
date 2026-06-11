/**
 * Date Utility Functions for Banking
 *
 * Provides date formatting and parsing utilities specific to banking needs:
 * - Currency transaction dates
 * - Statement periods
 * - Account history dates
 */

export function formatCurrencyDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
}

/**
 * Description placeholder
 *
 * @export
 * @param {(Date | string)} date
 * @returns {string}
 */
export function formatIsoDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} dateString
 * @returns {(Date | null)}
 */
export function parseTransactionDate(dateString: string): Date | null {
  const patterns = [
    /^(\d{2})\/(\d{2})\/(\d{4})$/,
    /^(\d{4})-(\d{2})-(\d{2})$/,
    /^(\d{4})-(\d{2})-(\d{2})T/,
  ];

  for (const pattern of patterns) {
    const match = dateString.match(pattern);
    if (match) {
      const parsed = new Date(dateString);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * Description placeholder
 *
 * @export
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {{ start: string; end: string; days: number }}
 */
export function getStatementPeriod(
  startDate: Date,
  endDate: Date,
): { start: string; end: string; days: number } {
  const start = formatCurrencyDate(startDate);
  const end = formatCurrencyDate(endDate);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return { days, end, start };
}

/**
 * Description placeholder
 *
 * @export
 * @param {number} days
 * @returns {Date}
 */
export function getRelativeDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Description placeholder
 *
 * @export
 * @param {(Date | string)} date
 * @param {Date} start
 * @param {Date} end
 * @returns {boolean}
 */
export function isWithinRange(
  date: Date | string,
  start: Date,
  end: Date,
): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d >= start && d <= end;
}

/**
 * Description placeholder
 *
 * @export
 * @param {(Date | string)} createdAt
 * @returns {string}
 */
export function formatAccountAge(createdAt: Date | string): string {
  const created =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Description placeholder
 *
 * @export
 * @param {Date} [date=new Date()]
 * @returns {number}
 */
export function getFiscalYear(date: Date = new Date()): number {
  const month = date.getMonth();
  const year = date.getFullYear();
  return month >= 9 ? year + 1 : year;
}

/**
 * Description placeholder
 *
 * @export
 * @param {Date} [date=new Date()]
 * @returns {(1 | 2 | 3 | 4)}
 */
export function getQuarter(date: Date = new Date()): 1 | 2 | 3 | 4 {
  const month = date.getMonth();
  if (month >= 9) return 4;
  if (month >= 6) return 3;
  if (month >= 3) return 2;
  return 1;
}

/**
 * Description placeholder
 *
 * @export
 * @param {(Date | string)} date
 * @returns {string}
 */
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    year: "numeric",
  });
}
