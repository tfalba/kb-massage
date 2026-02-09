// calendlySlotAdapters.ts
type GoogleSlot = { start: string; end: string };

type CalendlyLikeSlot = {
  start_time: string;           // ISO string
  end_time: string;             // ISO string
  timezone?: string;            // optional for convenience
};

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
    }))
    .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
  return { collection };
}
