import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../day-picker.css";
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
    const startDelay = new Date(Date.now() + HOURS(2));
 
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

  const buttonBase =
    "rounded-lg border px-3 py-2 font-belleza text-[clamp(0.9rem,1.1vw,1.3rem)] text-white transition duration-150 hover:-translate-y-[1px]  hover:shadow-md";
  const primaryButton = "border-gray-200 bg-brand-sage/80 hover:bg-brand-sage"
    const secondaryButton = "border-[#5dacd6] bg-brand-ocean hover:bg-brand-ocean/80 hover:border-brand-ocean"

    if (!type) return;

  return (
    <section className="flex flex-wrap justify-center gap-6 px-[2vw] py-[3vw]">
      <div className={`rounded-[18px] bg-white p-[2vw] ${type.duration === "60" ? "shadow-glow" : "shadow-glowBlue"}`}>
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

      <div className="flex min-w-[45%] flex-1 flex-col gap-4 rounded-[18px] bg-white p-[3vw] shadow-glow">
        {(loading1 || loading2) && (
          <p className="font-montserrat text-brand-forest/80">
            Loading availability…
          </p>
        )}
        {error1 && <p className="text-sm text-red-600">{error1}</p>}
        {error2 && <p className="text-sm text-red-600">{error2}</p>}

        {notLoadOrError && (
          <div className="flex items-center justify-center gap-4 border-b border-brand-sage/40 pb-3">
            <button
              className="text-[2rem] text-brand-forest transition disabled:opacity-30"
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
            <div className="text-center font-montserrat text-[clamp(1rem,1.4vw,1.8rem)] text-brand-earth">
              {selected?.toLocaleDateString()}
            </div>
            <button
              className="text-[2rem] text-brand-forest transition disabled:opacity-30"
              onClick={goNext}
              aria-label="Next day"
            >
              ›
            </button>
          </div>
        )}
        {notLoadOrError && !selected && (
          <p className="font-montserrat text-brand-earth">
            Select a date on the calendar to see available times.
          </p>
        )}
        {notLoadOrError && selected && daySlots.length === 0 && (
          <p className="font-montserrat text-brand-earth">
            No times available for this day.
          </p>
        )}
        {notLoadOrError && selected && daySlots.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-3">
            {daySlots.map((s, i) => (
              <li key={i}>
                <button
                  className={`${buttonBase} ${
                    type.duration === "60" ? primaryButton : secondaryButton
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
