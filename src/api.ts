import { useEffect, useState } from "react";
import { isoDaysFromNow, isoNow } from "./helpers/eventFormatter";
import { API_GCAL } from "./config";


export async function fetchAvailability(days: number = 14) {
  const start = isoNow();
  const end = isoDaysFromNow(days);
    // const url = `http://localhost:4001/gcal/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

  const url = `${API_GCAL}/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Availability failed (${res.status}): ${err}`);
  }
  // { slots: [{start, end}, ...], timezone, durationMin }
  return res.json();
}


export function useAvailability(startISO: string, endISO: string, duration: string = '60') {
  const [data, setData] = useState<{ slots: {start: string; end: string}[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
                const url = `${API_GCAL}/availability?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}&duration=${encodeURIComponent(duration)}`;

        // const url = `http://localhost:4001/gcal/availability?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}&duration=${encodeURIComponent(duration)}`;

        const res = await fetch(url, { signal: ac.signal });
        console.log('we are before the error throw')
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
        console.log('we are getting through the try')
        const json = await res.json();
        if (!ac.signal.aborted) setData(json);
      } catch (e: any) {
        if (!ac.signal.aborted) setError(e.message || "Failed to load availability");
      } finally {
        if (!ac.signal.aborted) {setLoading(false);
                    console.log(data);}

      }
    }

    run();
    return () => ac.abort();
  }, [startISO, endISO]);

  return { data, loading, error };
}

export async function bookAppointment(start: string, end: string, guestName: string, guestEmail: string, guestPhone: string, typeDuration: string) {
    const res = await fetch(`${API_GCAL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start, end, guestName, guestEmail, guestPhone, typeDuration}),
  });

    if (!res.ok) {
    throw new Error(`Booking failed: ${res.status} ${await res.text()}`);
  }

  return res.json(); // { ok: true, eventId, htmlLink }
}