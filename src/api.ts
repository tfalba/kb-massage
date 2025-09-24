import { useEffect, useState } from "react";
import { isoDaysFromNow, isoNow } from "./helpers/eventFormatter";

export async function getEventTypes() {
    // const response = await fetch("/api/event-types");
    const response = await fetch("http://localhost:3001/api/event-types");

    if (!response.ok) {
        console.log("Failed to fetch event types");
        throw new Error("Failed to fetch event types");
    }
    const data = await response.json();
    console.log(data);
    return data.collection || [];
}

export async function getAvailability(eventTypeUriOrId: string) {
    const p = new URLSearchParams({eventType: eventTypeUriOrId}) + '&weeks=4';
    console.log(p.toString());
    const r = await fetch(`/api/availability?${p.toString()}`);
    const j = await r.json();
    console.log(j);
    if (!r.ok) throw new Error(j.message || "Failed to fetch availability");
    return j.collection || [];

}

export async function getUserInfo() {
    const response = await fetch("/api/user");
    if (!response.ok) {
        console.log("Failed to fetch user info");
        throw new Error("Failed to fetch user info");
    }
    const data = await response.json();
    console.log(data);
    return data.scheduling_url;
}

export async function fetchAvailability(days: number = 14) {
  const start = isoNow();
  const end = isoDaysFromNow(days);
  const url = `http://localhost:4001/gcal/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

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
        const url = `http://localhost:4001/gcal/availability?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}&duration=${encodeURIComponent(duration)}`;
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