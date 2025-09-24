import { useEffect, useMemo, useState } from "react";
import { getAvailability, getEventTypes, useAvailability } from "../api";
import BookingModal from "./BookingModal";
import CalendarWithSlots from "./CalendarWithSlots";
import { groupSlotsByDayGoog, nyDayKey } from "../helpers/eventFormatter";
import { useModal } from "../context/useModal";
import { endOfMonth, startOfMonth } from "date-fns";
import { toCalendlyCollection, toCalendlySlotsByDay } from "../helpers/CalendlySlotAdaptors";

// type Slot = { start_time: string; end_time: string; scheduling_url: string; timezone?: string};
type Slot = { start_time: string; end_time: string; timezone?: string };

type CalendlyProps = {
    style?: React.CSSProperties; // TypeScript typing
};

type NewTypes = {name: string; duration: string}
export const newTypes: NewTypes[] = [{name: '60 min session', duration: '60'}, {name: '90 min session', duration: '90'}]

export default function EventTypesAlt({ style }: CalendlyProps) {
    const { isOpen, openModal, closeModal } = useModal();

    // const [types, setTypes] = useState<any[]>([]);
    // const [type, setType] = useState<string>("");
    const [type, setType] = useState<NewTypes>(newTypes[0])
    const [slots, setSlots] = useState<any[]>([]);
    const [err, setErr] = useState<string | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [month, setMonth] = useState(new Date());


    // const schedulingUrlWithDate = useMemo(() => {
    //     if (!selectedSlot) return "";
    //     const day = nyDayKey(selectedSlot.start_time);
    //     const u = new URL(selectedSlot.scheduling_url);
    //     u.searchParams.set("date", day); // if unsupported, Calendly just ignores it
    //     return u.toString();
    // }, [selectedSlot]);

    // useEffect(() => {
    //     getEventTypes().then(setTypes)
    //         .catch((e) => setErr(e.message));
    //     setSlots([]);
    // }, []);

        const startISO = startOfMonth(month).toISOString();
    const endISO = endOfMonth(month).toISOString();
    // const duration = type.includes('30') ? '90' : '60'

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
        // if (types?.length > 0 && (slots.length === 0 || !slots)) {
        //     console.log('check if this hits')
        //     // loadOld(types[0].uri || types[0].id, types[0].name)
        //     load(types[0].name)
        // }
        if (slots.length === 0) {
            setSlots(calendlyish1.collection)
        }
    }, [slots, calendlyish1])

    const handleEventTypeChange = (t: NewTypes) => {
        setType(t);
        if (t.duration === '60') {
            setSlots(calendlyish1.collection);
        } else {
            setSlots(calendlyish2.collection)
        }

    }


            
    // const load = async (type: string) => {
    //     setSlots([])
    //     try {
    //         setErr(null);
    //         const dur = type.includes('30') ? '90' : '60'
    //         const { data, loading, error } = await useAvailability(startISO, endISO, dur); // you can also pass just the ID
    //         if (!data?.slots) {console.log('no slots'); return;}
    //         const newData = toCalendlyCollection(data.slots);
    //         // const newData = !data?.slots ? [] as ReturnType<typeof toCalendlyCollection>["collection"] : toCalendlyCollection(data.slots) ;
    //         setSlots(newData.collection);
    //         console.log(newData.collection)
    //         // setLoading(false);
    //         setType(type);
    //     // }
    //     // finally {
    //     //     const calendlyish = useMemo(() => {
    //     //         if (!data?.slots) return { collection: [] as ReturnType<typeof toCalendlyCollection>["collection"] };
    //     //         return toCalendlyCollection(data.slots);
    //     //     }, [data?.slots]);
    //     //     setSlots(calendlyish.collection);
    //     //     // setLoading(false);
    //     //     setType(type);
    //     } catch (e: any) {
    //         setErr(e.message);
    //     }
    // }


    // const loadOld = async (eventTypeUri: string, type: string) => {
    //     setSlots([])
    //     // setLoading(true);
    //     try {
    //         setErr(null);
    //         const times = await getAvailability(eventTypeUri); // you can also pass just the ID
    //         setSlots(times);
    //         // setLoading(false);
    //         setType(type);
    //     } catch (e: any) {
    //         setErr(e.message);
    //         // setLoading(false);
    //     }
    // };

    if (err) {
        return <div>Error: {err}</div>;
    }
    // if (types.length === 0) {
    //     return <div>Loading...</div>;
    // }

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
            <div style={{ width: '100%', background: '#8ba87c8f' }}>
                <h2 style={{ backgroundColor: "#fff9f3", color: '#414b3a', margin: 0, padding: '2vw', display: 'flex', justifyContent: 'space-between' }}>Booking Options
                    <button style={{ fontSize: 'calc(10px + 1.5vw)', border: 'none', background: 'none', fontFamily: 'Montserrat' }} onClick={closeModal}>X</button>
                </h2>
                {err && <p style={{ color: "crimson" }}>{err}</p>}
                <section className='EventTypes-section'>
                    <ul className='EventTypes-outer'>
                        {newTypes.map((t, i) => (
                            <li className='EventTypes-inner' key={i}>
                                <button className={`EventTypes-button ${type === t ? 'EventTypes-button-active' : ''}`} onClick={() => handleEventTypeChange(t)}>
                                    {t.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <CalendarWithSlots
                        // eventTypeIdOrUri={types.find(t => t.name === type)?.uri || types.find(t => t.name === type)?.id}
                        weeks={4}
                        type={type}
                        slots={slots}
                        // slots={calendlyish.collection}
                        // byDay={byDay}
                        // slots={data}
                        // loading={loading}
                        onSelectSlot={(slot) => {
                            handleSlotSelect(slot);
                        }}
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


