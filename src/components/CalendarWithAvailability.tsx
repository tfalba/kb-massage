import { DayPicker } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";
import { useAvailability } from "../api";
import { groupSlotsByDayGoog } from "../helpers/eventFormatter";

export default function CalendarWithAvailability({duration = '60'}: {duration: string}) {
  const [month, setMonth] = useState(new Date());

  const startISO = startOfMonth(month).toISOString();
  const endISO = endOfMonth(month).toISOString();

  const { data, loading, error } = useAvailability(startISO, endISO, duration);
  const byDay = groupSlotsByDayGoog(data?.slots ?? []);

  return (
    <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: "1rem" }}>
      <DayPicker month={month} onMonthChange={setMonth} />
      <div>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {!loading && !error && (
          <ul>
            {[...byDay.keys()].map((day) => (
              <li key={day}>
                <strong>{day}</strong>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {byDay.get(day)!.map((s, i) => (
                    <button key={i}>
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "America/New_York",
                      }).format(new Date(s.start))}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

