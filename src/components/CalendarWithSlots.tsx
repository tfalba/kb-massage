// CalendarWithSlots.tsx
import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import classNames from "react-day-picker/style.module.css";

import "react-day-picker/dist/style.css";
import { nycTime, nyDayKey } from "../helpers/eventFormatter";
import BookingModal from "./BookingModal/BookingModal";
import { useAvailability } from "../api";
import { endOfMonth } from "date-fns";
import { toCalendlyCollection } from "../helpers/CalendlySlotAdaptors";
// import { NY_TZ, nyDayKey, nyTime } from "./dateUtils";

type Slot = { start_time: string; end_time: string; };


function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function CalendarWithSlots({
    // slots,
    // typeDuration,
    type
}: {
    // slots: Slot[],
    // typeDuration: string;
    type: {name: string, duration: string}
}) {
    const currentDay = new Date();
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Date | undefined>(currentDay);
    const [slot, setSlot] = useState<Slot | null>(null)
        const [slots, setSlots] = useState<any[]>([]);

    const [month, setMonth] = React.useState<Date>(new Date());

    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

        const startISO = startOfMonth(month).toISOString();
        const date = new Date();
        const nextMonth = new Date(date);
        nextMonth.setMonth(date.getMonth() + 1);
        const endISO = endOfMonth(nextMonth).toISOString();
    
        const { data: data1, loading: loading1, error: error1 } = useAvailability(startISO, endISO, '60');
        const { data: data2, loading: loading2, error: error2 } = useAvailability(startISO, endISO, '90');
    
        const calendlyish1 = useMemo(() => {
            if (!data1?.slots) return { collection: [] as ReturnType<typeof toCalendlyCollection>["collection"] };
            return toCalendlyCollection(data1.slots);
        }, [data1?.slots]);
        const calendlyish2 = useMemo(() => {
            if (!data2?.slots) return { collection: [] as ReturnType<typeof toCalendlyCollection>["collection"] };
            return toCalendlyCollection(data2.slots);
        }, [data2?.slots]);
    
        useEffect(() => {
            if (loading1) return;
            if (loading2) return;
            if (error1) return;
            if (error2) return;
           if (type.duration === '90') {
            setSlots(calendlyish2.collection);
           } else {
            setSlots(calendlyish1.collection);
           }
        }, [type, loading1, loading2, error1, error2])

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

    // Slots just for the selected day
    // DO WE STILL NEED THIS OR DO SLOTS COME IN ALREADY SORTED?
    const daySlots = useMemo(() => {
        if (!selected) return [];
        const key = nyDayKey(selected.toISOString());
        console.log(selected.getDate())
        return slots
            .filter(s => nyDayKey(s.start_time) === key)
            .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
    }, [selected, slots]);

    return (
        <section className="cal-slots">
            <div className="cal" style={{ padding: '3vw' }}>
                <DayPicker
                    mode="single"
                    selected={selected}
                    // classNames={{ nav: "my-rdp-navigator" }}
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
                    numberOfMonths={1}
                    weekStartsOn={0}
                    month={month}
                    onMonthChange={(m) => { setMonth(m); if (startOfMonth(m) < currentDay) { setSelected(currentDay) } else { setSelected(startOfMonth(m)) } }}
                />
            </div>

            <div className="slots" style={{ display: 'flex', flexDirection: 'column', padding: '3vw', flex: '1', minWidth: '45%' }}>
                {(loading) && <p>Loading availability…</p>}
                {error && <p style={{ color: "crimson" }}>{error}</p>}
                {!loading && !error && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '2vw' }}>
                        <button
                            className="dc-nav"
                            onClick={goPrev}
                              disabled={!selected || ((selected.getMonth() === new Date().getMonth()) && (selected.getDate() - 1) < new Date().getDate())}
                            aria-label="Previous day"
                        >
                            ‹
                        </button>
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
                                    className= {`${type.duration === '60' ? 'slot-btn' : 'slot-btn slot-btn-sec'}`}
                                    onClick={() => {setOpen(true); setSlot(s)}}
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
            {slot && 
            <BookingModal
                open={open}
                onClose={() => setOpen(false)}
                slot={slot}
                typeDuration={type.duration}
            />
}
        </section>
    );
}
