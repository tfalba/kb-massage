import '../App.css';
import EventTypesAlt from './EventTypesAlt';

type CalendlyProps = {
  style?: React.CSSProperties; // TypeScript typing
};

const MyCalendlyAlt = ({ style }: CalendlyProps) => {

    return (
         <div  className="Calendly"
            id="calendly-dock" style={{height: 'max-content', ...style }}>
            <EventTypesAlt />
        </div>
    );
};

export default MyCalendlyAlt;