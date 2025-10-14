import { useState } from "react";
import CalendarWithSlots from "./CalendarWithSlots";
import { useModal } from "../context/useModal";

type NewType = { name: string; duration: string }
export const newTypes: NewType[] = [{ name: '60 Min Session', duration: '60' }, { name: '90 Min Session', duration: '90' }]

type CalendlyProps = {
    style?: React.CSSProperties; // TypeScript typing
};

export default function EventTypes({ style }: CalendlyProps) {
    const { closeModal } = useModal();
    const [type, setType] = useState<NewType>(newTypes[0])

    const date = new Date();
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);


    const handleEventTypeChange = (t: NewType) => {
        setType(t);
        if (t.duration === '60') {
        } else {
        }
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
                <section className='EventTypes-section'>
                    <CalendarWithSlots
                        type = {type}
                    />
                </section>
            </div>

        </div>
    );
}


