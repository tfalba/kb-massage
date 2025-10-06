import { useEffect, useMemo, useState } from "react";
import { useAvailability } from "../api";
import CalendarWithSlots from "./CalendarWithSlots";
import { useModal } from "../context/useModal";
import { endOfMonth, startOfMonth } from "date-fns";
import { toCalendlyCollection } from "../helpers/CalendlySlotAdaptors";

// type Slot = { start_time: string; end_time: string; scheduling_url: string; timezone?: string};
type Slot = { start_time: string; end_time: string; timezone?: string };

type NewType = { name: string; duration: string }
export const newTypes: NewType[] = [{ name: '60 Min Session', duration: '60' }, { name: '90 Min Session', duration: '90' }]

type CalendlyProps = {
    style?: React.CSSProperties; // TypeScript typing
};

export default function EventTypes({ style }: CalendlyProps) {
    const { closeModal } = useModal();

    // const [types, setTypes] = useState<any[]>([]);
    // const [type, setType] = useState<string>("");
    const [type, setType] = useState<NewType>(newTypes[0])
    const [slots, setSlots] = useState<any[]>([]);
    const [err, setErr] = useState<string | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [month, setMonth] = useState(new Date());

    const startISO = startOfMonth(month).toISOString();
    const date = new Date();
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);
    const endISO = endOfMonth(nextMonth).toISOString();

    // const { data: data1, loading: loading1, error: error1 } = useAvailability(startISO, endISO, '60');
    // const { data: data2, loading: loading2, error: error2 } = useAvailability(startISO, endISO, '90');

    // const calendlyish1 = useMemo(() => {
    //     if (!data1?.slots) return { collection: [] as ReturnType<typeof toCalendlyCollection>["collection"] };
    //     return toCalendlyCollection(data1.slots);
    // }, [data1?.slots]);
    // const calendlyish2 = useMemo(() => {
    //     if (!data2?.slots) return { collection: [] as ReturnType<typeof toCalendlyCollection>["collection"] };
    //     return toCalendlyCollection(data2.slots);
    // }, [data2?.slots]);

    // useEffect(() => {
    //     if (slots.length === 0) {
    //         setSlots(calendlyish1.collection)
    //     }
    // }, [slots, calendlyish1])

    const handleEventTypeChange = (t: NewType) => {
        setType(t);
        if (t.duration === '60') {
            // setSlots(calendlyish1.collection);
        } else {
            // setSlots(calendlyish2.collection)
        }

    }


    if (err) {
        return <div>Error: {err}</div>;
    }

    const handleSlotSelect = (slot: Slot) => {
        setSelectedSlot(slot);
        setOpen(true);
    };

    if (!slots) {
        return;
    }

    return (
        <div className="Calendly"
            id="calendly-dock" style={{ height: 'max-content', ...style }}>
            <div style={{ width: '100%', background: '#fff9f3' }}>
                <div style={{ backgroundColor: "#fff9f3", color: '#414b3a', margin: 0, padding: '2vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{color: '#414b3a', margin: 0, flex: 1.5, textAlign: 'left'}}>Booking Options </h2>

                    <ul className='EventTypes-outer'>
                        {newTypes.map((t, i) => (
                            <li className='EventTypes-inner' key={i}>
                                <button className={`EventTypes-button ${type.duration === '60' && type.duration === t.duration ? 'EventTypes-button-active' : type.duration === '90' && type.duration===t.duration ? 'EventTypes-button-sec-active' : ''}`} onClick={() => handleEventTypeChange(t)}>
                                    {t.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button style={{ fontSize: 'calc(10px + 1.5vw)', border: 'none', background: 'none', fontFamily: 'Montserrat' }} onClick={closeModal}>X</button>

                </div>
                {err && <p style={{ color: "crimson" }}>{err}</p>}
                <section className='EventTypes-section'>
                    {/* <ul className='EventTypes-outer'>
                        {newTypes.map((t, i) => (
                            <li className='EventTypes-inner' key={i}>
                                <button className={`EventTypes-button ${type === t ? 'EventTypes-button-active' : ''}`} onClick={() => handleEventTypeChange(t)}>
                                    {t.name}
                                </button>
                            </li>
                        ))}
                    </ul> */}
                    <CalendarWithSlots
                        // slots={slots}
                        type = {type}
                        // typeDuration={type.duration}
                    />
                    {/* <BookingModal
                    open={open}
                    onClose={() => setOpen(false)}
                    schedulingUrl={schedulingUrlWithDate}
                /> */}
                </section>
            </div>

        </div>
    );
}


