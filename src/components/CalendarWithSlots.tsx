// CalendarWithSlots.tsx
import React, { useEffect, useMemo, useState } from "react";
import { DayPicker, labelMonthDropdown, type CaptionProps } from "react-day-picker";
import classNames from "react-day-picker/style.module.css";

import "react-day-picker/dist/style.css";
import { nycTime, nyDayKey } from "../helpers/eventFormatter";
import BookingModal from "./BookingModal";
import DayCarousel from "./DayCarousel";
// import { NY_TZ, nyDayKey, nyTime } from "./dateUtils";

type Slot = { start_time: string; end_time: string; timezone?: string; scheduling_url?: string };

function CustomCaption({ displayMonth }: { displayMonth: Date }) {
    const month = displayMonth.toLocaleDateString("en-US", { month: "long" });
    const year = displayMonth.getFullYear();
    return (
        <div style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: 600 }}>
            {month} {year}
        </div>
    );
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function CalendarWithSlots({
    // eventTypeIdOrUri,
    type,
    weeks = 4,
    slots,
    onSelectSlot,
    // byDay,
}: {
    // eventTypeIdOrUri: string;    // accept ID or URI; your backend normalizes it
    type?: string;
    weeks?: number;
    slots: Slot[];
    onSelectSlot?: (slot: Slot) => void;
    // byDay: any
}) {
    const currentDay = new Date();
    // const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Date | undefined>(currentDay);
    const [month, setMonth] = React.useState<Date>(new Date());

    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    // const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    // const schedulingUrlWithDate = useMemo(() => {
    //     if (!selectedSlot) return "";
    //     const day = nyDayKey(selectedSlot.start_time);
    //     const u = new URL(selectedSlot.scheduling_url);
    //     u.searchParams.set("date", day); // if unsupported, Calendly just ignores it
    //     return u.toString();
    // }, [selectedSlot]);

    // Fetch a few weeks of availability
    // useEffect(() => {
    //     let mounted = true;
    //     setLoading(true);
    //     setError(null);
    //     const qs = new URLSearchParams({ eventType: eventTypeIdOrUri }) + '&weeks=4';
    //     console.log("Fetching availability with query string:", qs);

    //     // const qs = new URLSearchParams({ eventType: eventTypeIdOrUri, weeks: String(weeks) });
    //     fetch(`/api/availability?${qs.toString()}`)
    //         .then(r => r.json().then(j => ({ ok: r.ok, j })))
    //         .then(({ ok, j }) => {
    //             if (!mounted) return;
    //             if (!ok) throw new Error(j?.message || j?.error || "Failed to load availability");
    //             setSlots(j.collection || []);
    //         })
    //         .catch(e => mounted && setError(e.message))
    //         .finally(() => mounted && setLoading(false));
    //     return () => { mounted = false; };
    // }, [eventTypeIdOrUri, weeks]);

    // Build a set of available day keys for quick lookups
    const availableDayKeys = useMemo(() => {
        const set = new Set<string>();
        for (const s of slots) set.add(nyDayKey(s.start_time));
        return set;
    }, [slots]);

    // Disable days that have no availability
    const disabled = (day: Date) => !availableDayKeys.has(nyDayKey(day.toISOString()));

    const goPrev = () => {
        if (!selected) return;
        const prev = new Date(selected);
        prev.setDate(prev.getDate() - 1);
        setSelected(prev);
        if (prev) setMonth(startOfMonth(prev))
    };

    const goNext = () => {
        if (!selected) return;
        const next = new Date(selected);
        next.setDate(next.getDate() + 1);
        setSelected(next);
                if (next) setMonth(startOfMonth(next))

    };

    // useEffect(() => {
    //     if (selected && startOfMonth(selected).getDate() !== startOfMonth(month).getDate()) {
    //         console.log(selected, startOfMonth(selected), month, startOfMonth(month))
    //         setSelected(month);
    //     }
    
    // }, [selected, month]);

    // Slots just for the selected day
    const daySlots = useMemo(() => {
        if (!selected) return [];
        const key = nyDayKey(selected.toISOString());
        console.log(selected.getDate())
        return slots
            .filter(s => nyDayKey(s.start_time) === key)
            .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
    }, [selected, slots, setSelected]);

    return (
        <section className="cal-slots">
            <div className="cal" style={{padding: '1vw'}}>
                <DayPicker
                    mode="single"
                    selected={selected}
                    // classNames={{ nav: "my-rdp-navigator" }}
                    // onSelect={setSelected}
                     onSelect={(d) => {
        setSelected(d);
        if (d) setMonth(startOfMonth(d));   // <- jump to the picked month
      }}
                    formatters={{
                        formatCaption: (month: Date) =>
                            month.toLocaleDateString("en-US", { month: "long" })
                    }}

                    // Only enable days that have availability:
                    disabled={disabled}
                    // Optional: from today to the end of fetched window
                    fromDate={new Date()}
                    numberOfMonths={1}
                    weekStartsOn={0}
                    month={month}
                    onMonthChange={(m) => {setMonth(m); if (startOfMonth(m) < currentDay) {setSelected(currentDay)} else {setSelected(startOfMonth(m))}}}
                />
            </div>

            <div className="slots" style={{display:'flex', flexDirection: 'column', padding: '1vw', flex: '2'}}>
                {loading && <p>Loading availability…</p>}
                {error && <p style={{ color: "crimson" }}>{error}</p>}
                {!loading && !error && (
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2vw'}}>
                         <button
                            className="dc-nav"
                            onClick={goPrev}
                            //   disabled={!canPrev}
                            aria-label="Previous day"
                        >
                            ‹
                        </button>
                        {/* <div className='dc-title'>{type}</div> */}
                        <div className='dc-title'>{selected?.toLocaleDateString()}</div>
                          <button
                            className="dc-nav"
                            onClick={goNext}
                            //   disabled={!canPrev}
                            aria-label="Next day"
                        >
                            ›
                        </button>
                    </div>
                )}
                {!loading && !error && !selected && (
                    <p>Select a date on the calendar to see available times.</p>
                )}
                {!loading && !error && selected && daySlots.length === 0 && (
                    <p>No times available for this day.</p>
                )}
                {!loading && !error && selected && daySlots.length > 0 && (
                       
                        <ul className="slot-list">
                            {daySlots.map((s, i) => (
                                <li key={i}>
                                    <button
                                        className="slot-btn"
                                        onClick={() => onSelectSlot?.(s)}
                                    //   aria-label={`${nycTime.format(new Date(s.start_time))} to ${nycTime.format(new Date(s.end_time))} Eastern Time`}
                                    >
                                        {nycTime.format(new Date(s.start_time))}

                                    </button>
                                </li>
                            ))}
                        </ul>

        )}
                {/* )} */}
            </div>
            {/* <BookingModal
                open={open}
                onClose={() => setOpen(false)}
                schedulingUrl={schedulingUrlWithDate}
            /> */}
        </section>
    );
}
