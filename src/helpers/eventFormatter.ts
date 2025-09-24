// formatters for America/New_York
const NY_TZ = "America/New_York";

const nycDateHeading = new Intl.DateTimeFormat("en-US", {
  timeZone: NY_TZ,
  weekday: "short",  // Mon
  month: "short",    // Sep
  day: "numeric",    // 8
});

export const nycTime = new Intl.DateTimeFormat("en-US", {
  timeZone: NY_TZ,
  hour: "numeric",
  minute: "2-digit",
});

// "Mon, Sep 8 • 10:00–10:30 AM ET"
export function formatNYCRange(startUtc: string, endUtc: string) {
  const s = new Date(startUtc);
  const e = new Date(endUtc);
  return `${nycDateHeading.format(s)} • ${nycTime.format(s)}–${nycTime.format(e)} ET`;
}

// get a stable "day key" in NY time (YYYY-MM-DD for grouping)
export function nyDayKey(utcIso: string) {
  const d = new Date(utcIso);
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: NY_TZ, year: "numeric" }).format(d);
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: NY_TZ, month: "2-digit" }).format(d);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: NY_TZ, day: "2-digit" }).format(d);
  return `${y}-${m}-${day}`; // e.g., 2025-09-08
}

// group slots (expects Calendly's { start_time, end_time } items)
export function groupSlotsByNYDay<T extends { start_time: string; end_time: string }>(slots: T[]) {
  // sort by start time just in case
  const sorted = [...slots].sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
  const map = new Map<string, T[]>();

  for (const s of sorted) {
    const key = nyDayKey(s.start_time);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }

  // turn into an array with a readable heading
  return Array.from(map.entries()).map(([key, items]) => {
    // heading like "Mon, Sep 8"
    const heading = nycDateHeading.format(new Date(items[0].start_time));
    return { key, heading, items };
  });
}

export const DAYS = (n: number) => 24 * 60 * 60 * 1000 * n;

export function isoNow() {
  return new Date().toISOString();
}

export function isoDaysFromNow(n: number) {
  return new Date(Date.now() + DAYS(n)).toISOString();
}

export function groupSlotsByDayGoog(slots: {start: string; end: string}[], timeZone = "America/New_York") {
  const fmtDay = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const map = new Map<string, {start: string; end: string}[]>();

  for (const s of slots) {
    const key = fmtDay.format(new Date(s.start)); // e.g. 2025-09-22
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  // sort each day's slots
  for (const [, arr] of map) arr.sort((a, b) => +new Date(a.start) - +new Date(b.start));
  return map;
}