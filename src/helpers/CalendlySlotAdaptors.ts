// calendlySlotAdapters.ts
export type GoogleSlot = { start: string; end: string };

export type CalendlyLikeSlot = {
  start_time: string;           // ISO string
  end_time: string;             // ISO string
  timezone?: string;            // optional for convenience
  // invitees_remaining?: number // add if your UI expects it; set to 1, for example
};

function dayKeyISO(dateIso: string, timeZone: string) {
  // e.g. "2025-09-23" in the desired TZ
  const d = new Date(dateIso);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d); // YYYY-MM-DD
}

/** Group Google slots by local day key and map to Calendly-like shape */
export function toCalendlySlotsByDay(
  googleSlots: GoogleSlot[],
  timeZone = "America/New_York"
): Map<string, CalendlyLikeSlot[]> {
  const map = new Map<string, CalendlyLikeSlot[]>();

  for (const s of googleSlots) {
    const key = dayKeyISO(s.start, timeZone);
    const calSlot: CalendlyLikeSlot = {
      start_time: s.start,
      end_time: s.end,
      timezone: timeZone,
      // invitees_remaining: 1,
    };
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(calSlot);
  }

  // sort each day's slots by start_time
  for (const [, arr] of map) {
    arr.sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
  }

  return map;
}

/** Flat collection like Calendly's { collection: [...] } */
export function toCalendlyCollection(
  googleSlots: GoogleSlot[],
  timeZone = "America/New_York"
): { collection: CalendlyLikeSlot[] } {
  const collection = googleSlots
    .map((s) => ({
      start_time: s.start,
      end_time: s.end,
      timezone: timeZone,
      // invitees_remaining: 1,
    }))
    .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
  return { collection };
}
