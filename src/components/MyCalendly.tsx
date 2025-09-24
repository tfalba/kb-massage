import { useLocation } from 'react-router';
import '../App.css';
import EventTypes from './EventTypes';

const shouldShow = (pathname: string) => pathname.startsWith("/book");


const MyCalendly = () => {
    const {pathname, search}= useLocation();
    const visible = shouldShow(pathname);
    const params = new URLSearchParams(search);

    const eventType = params.get('type');
    console.log("Calendly event type:", eventType);

    return (
         <div  className="Calendly"
            id="calendly-dock" style={{ display: visible ? "flex" : "none" }}>
            <EventTypes eventType={eventType || null} />
        </div>
    );
};

export default MyCalendly;