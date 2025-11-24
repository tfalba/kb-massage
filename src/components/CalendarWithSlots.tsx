import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { HOURS, nycTime, nyDayKey } from "../helpers/eventFormatter";
import BookingModal from "./BookingModal/BookingModal";
import { useAvailability } from "../api";
import { endOfMonth } from "date-fns";
import { toCalendlyCollection } from "../helpers/CalendlySlotAdaptors";

type Slot = { start_time: string; end_time: string };

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function CalendarWithSlots({
  type,
}: {
  type: { name: string; duration: string };
}) {
  const currentDay = new Date();
  const [selected, setSelected] = useState<Date | undefined>(currentDay);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<any[]>([]);

  const [month, setMonth] = React.useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const startISO = startOfMonth(month).toISOString();
  const date = new Date();
  const nextMonth = new Date(date);
  nextMonth.setMonth(date.getMonth() + 1);
  const endISO = endOfMonth(nextMonth).toISOString();

  const {
    data: data1,
    loading: loading1,
    error: error1,
  } = useAvailability(startISO, endISO, "60");
  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useAvailability(startISO, endISO, "90");

  const calendlyish1 = useMemo(() => {
    if (!data1?.slots)
      return {
        collection: [] as ReturnType<typeof toCalendlyCollection>["collection"],
      };
    return toCalendlyCollection(data1.slots);
  }, [data1?.slots]);
  const calendlyish2 = useMemo(() => {
    if (!data2?.slots)
      return {
        collection: [] as ReturnType<typeof toCalendlyCollection>["collection"],
      };
    return toCalendlyCollection(data2.slots);
  }, [data2?.slots]);

  useEffect(() => {
    if (loading1) return;
    if (loading2) return;
    if (error1) return;
    if (error2) return;
    if (type.duration === "90") {
      setSlots(calendlyish2.collection);
    } else {
      setSlots(calendlyish1.collection);
    }
  }, [type, loading1, loading2, error1, error2]);

  // Build a set of available day keys for quick lookups
  const availableDayKeys = useMemo(() => {
    const set = new Set<string>();
    for (const s of slots) set.add(nyDayKey(s.start_time));
    return set;
  }, [slots]);

  // Disable days that have no availability
  const disabled = (day: Date) =>
    !availableDayKeys.has(nyDayKey(day.toISOString()));

  const goPrev = () => {
    if (!selected) return;
    const prev = new Date(selected);
    prev.setDate(prev.getDate() - 1);
    setSelected(prev);
    if (prev) setMonth(startOfMonth(prev));
  };

  const goNext = () => {
    if (!selected) return;
    const next = new Date(selected);
    next.setDate(next.getDate() + 1);
    setSelected(next);
    if (next) setMonth(startOfMonth(next));
  };

  // Slots just for the selected day
  const daySlots = useMemo(() => {
    if (!selected) return [];
    const startDelay = new Date(Date.now() + HOURS(2))
    
    const key = nyDayKey(selected.toISOString());
    return slots
      .filter((s) => new Date(s.start_time) > startDelay)
      .filter((s) => nyDayKey(s.start_time) === key)
      .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
  }, [selected, slots]);

  const notLoadOrError = useMemo(() => {
    if (!loading1 && !loading2 && !error1 && !error2) {
      return true;
    } else return false;
  }, [loading1, loading2, error1, error2]);

  return (
    <section className="cal-slots flex flex-wrap jcc">
      <div className="cal">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            setSelected(d);
            if (d) setMonth(startOfMonth(d)); // <- jump to the picked month
          }}
          formatters={{
            formatCaption: (month: Date) =>
              month.toLocaleDateString("en-US", { month: "long" }),
          }}
          // Only enable days that have availability:
          disabled={disabled}
          numberOfMonths={1}
          weekStartsOn={0}
          month={month}
          onMonthChange={(m) => {
            setMonth(m);
            if (startOfMonth(m) < currentDay) {
              setSelected(currentDay);
            } else {
              setSelected(startOfMonth(m));
            }
          }}
        />
      </div>

      <div className="slots flex-col">
        {(loading1 || loading2) && <p>Loading availability…</p>}
        {error1 && <p style={{ color: "crimson" }}>{error1}</p>}
        {error2 && <p style={{ color: "crimson" }}>{error2}</p>}

        {notLoadOrError && (
          <div className="dc-nav-cont jcc aic">
            <button
              className="dc-nav m0"
              onClick={goPrev}
              disabled={
                !selected ||
                (selected.getMonth() === new Date().getMonth() &&
                  selected.getDate() - 1 < new Date().getDate())
              }
              aria-label="Previous day"
            >
              ‹
            </button>
            <div className="dc-title flex-col m0 fs-main">
              {selected?.toLocaleDateString()}
            </div>
            <button
              className="dc-nav m0"
              onClick={goNext}
              aria-label="Next day"
            >
              ›
            </button>
          </div>
        )}
        {notLoadOrError && !selected && (
          <p>Select a date on the calendar to see available times.</p>
        )}
        {notLoadOrError && selected && daySlots.length === 0 && (
          <p>No times available for this day.</p>
        )}
        {notLoadOrError && selected && daySlots.length > 0 && (
          <ul className="slot-list flex flex-wrap jcc m0">
            {daySlots.map((s, i) => (
              <li key={i}>
                <button
                  className={`${
                    type.duration === "60"
                      ? "slot-btn ff-b"
                      : "slot-btn slot-btn-sec ff-b"
                  }`}
                  onClick={() => {
                    setOpen(true);
                    setSlot(s);
                  }}
                >
                  {nycTime.format(new Date(s.start_time))}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {slot && (
        <BookingModal
          open={open}
          onClose={() => setOpen(false)}
          slot={slot}
          typeDuration={type.duration}
        />
      )}
    </section>
  );
}
