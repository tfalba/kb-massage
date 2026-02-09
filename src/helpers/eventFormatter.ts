// formatters for America/New_York
const NY_TZ = "America/New_York";

export const nycTime = new Intl.DateTimeFormat("en-US", {
  timeZone: NY_TZ,
  hour: "numeric",
  minute: "2-digit",
});

// get a stable "day key" in NY time (YYYY-MM-DD for grouping)
export function nyDayKey(utcIso: string) {
  const d = new Date(utcIso);
  const y = new Intl.DateTimeFormat("en-CA", {
    timeZone: NY_TZ,
    year: "numeric",
  }).format(d);
  const m = new Intl.DateTimeFormat("en-CA", {
    timeZone: NY_TZ,
    month: "2-digit",
  }).format(d);
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: NY_TZ,
    day: "2-digit",
  }).format(d);
  return `${y}-${m}-${day}`; // e.g., 2025-09-08
}

export const HOURS = (n: number) => 60 * 60 * 1000 * n;

export function groupBookingIntoStandard(slot: {
  start_time: string;
  end_time: string;
}) {
  const startDate = new Date(slot.start_time);
  const endDate = new Date(slot.end_time);
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York", // <-- important if you want a specific TZ
  });
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York", // <-- important if you want a specific TZ
  });
  const date = startDate.getDate();
  const month = startDate.toLocaleString("en-US", { month: "short" });
  const year = startDate.getFullYear();
  return `${month} ${date}, ${year} / ${startTime} - ${endTime} `;
}
