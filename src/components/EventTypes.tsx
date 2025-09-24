import { useEffect, useMemo, useState } from "react";
import { getAvailability, getEventTypes } from "../api";
import DayCarousel from "./DayCarousel";
import BookingModal from "./BookingModal";
import { nyDayKey } from "../helpers/eventFormatter";
import { startOfMonth, endOfMonth } from "date-fns"; // or write your own



type Slot = { slot: {start_time: string; end_time: string}; timezone?: string };

export default function EventTypes() {
    const [types, setTypes] = useState<any[]>([]);
    const [type, setType] = useState<string | null>( null);
    const [slots, setSlots] = useState<any[]>([]);
    const [err, setErr] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
   
    

    useEffect(() => {
        if ( (slots.length === 0)) {

          
                load(types[0].uri || types[0].id, types[0].duration, types[0].name);
        
        }
    }, [types.length]);

    const load = async (eventTypeUri: string, dur: number, type: string | null) => {
        setSlots([])
        setLoading(true);
        try {
            setErr(null);
            const times = await getAvailability(eventTypeUri); // you can also pass just the ID
            setSlots(times);
            setDuration(dur);
            setLoading(false);
            setType(type);
        } catch (e: any) {
            setErr(e.message);
            setLoading(false);
        }
    };

    if (err) {
        return <div>Error: {err}</div>;
    }
    // if (types.length === 0) {
    //     return <div>Loading...</div>;
    // }

    const handleSlotSelect = (slot: Slot) => {
        setSelectedSlot(slot);
        setOpen(true);
        // setEventTypeSchedulingUrl(slot.eventTypeSchedulingUrl);
    };



    return (
        <div style={{ width: '100%' }}>
            <h2 style={{backgroundColor: "#414b3a", margin: 0, padding: '2vw 0'}}>Booking Options</h2>
            {err && <p style={{ color: "crimson" }}>{err}</p>}
            <section className='EventTypes-section'>
                <ul className='EventTypes-outer'>
                    {types.map((t, i) => (
                        <li className='EventTypes-inner' key={i}>
                            <button className={`EventTypes-button ${type === t.name ? 'EventTypes-button-active' : ''}`} onClick={() => load(t.uri || t.id, t.duration, t.name)}>
                                {t.name}
                            </button>
                        </li>
                    ))}
                </ul>
                {slots.length > 0 && loading === false ?
                    <DayCarousel
                        slots={slots}
                        title={`${type}: Available Times `}
                        onSelect={(slot) => {
                            handleSlotSelect(slot);
                            // Do something: open Calendly, prefill, or store selection
                            console.log("Selected slot:", slot);
                        }}
                    /> : <div className='EventTypes-loading'>Loading...</div>

                }
                {/* <BookingModal
                    open={open}
                    onClose={() => setOpen(false)}
                    schedulingUrl={schedulingUrlWithDate}
                /> */}
            </section>

        </div>
    );
}


