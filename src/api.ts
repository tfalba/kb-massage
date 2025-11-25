import { useEffect, useState } from "react";
import { API_GCAL } from "./config";

export function useAvailability(
  startISO: string,
  endISO: string,
  duration: string = "60"
) {
  const [data, setData] = useState<{
    slots: { start: string; end: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function run(attempt: number = 1) {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_GCAL}/availability?start=${encodeURIComponent(
          startISO
        )}&end=${encodeURIComponent(endISO)}&duration=${encodeURIComponent(
          duration
        )}`;

        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
        const json = await res.json();
        if (!ac.signal.aborted) setData(json);
      } catch (e: any) {
        if (ac.signal.aborted) return;
        if (attempt < 2) {
          setTimeout(() => {
            run(attempt + 1);
          }, 1200);
          return;
        }
        setError(e.message || "Failed to load availability");
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
        }
      }
    }

    run();
    return () => ac.abort();
  }, [startISO, endISO, duration]);

  return { data, loading, error };
}

export async function bookAppointment(
  start: string,
  end: string,
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  typeDuration: string
) {
  const res = await fetch(`${API_GCAL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start,
      end,
      guestName,
      guestEmail,
      guestPhone,
      typeDuration,
    }),
  });

  if (!res.ok) {
    throw new Error(`Booking failed: ${res.status} ${await res.text()}`);
  }

  return res.json(); // { ok: true, eventId, htmlLink }
}
