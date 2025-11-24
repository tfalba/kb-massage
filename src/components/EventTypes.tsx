import { useState } from "react";
import CalendarWithSlots from "./CalendarWithSlots";
import { useModal } from "../context/useModal";

type NewType = { name: string; duration: string };
export const newTypes: NewType[] = [
  { name: "60 Min Session", duration: "60" },
  { name: "90 Min Session", duration: "90" },
];

export default function EventTypes() {
  const { closeModal } = useModal();
  const [type, setType] = useState<NewType>(newTypes[0]);

  const date = new Date();
  const nextMonth = new Date(date);
  nextMonth.setMonth(date.getMonth() + 1);

  const handleEventTypeChange = (t: NewType) => {
    setType(t);
    if (t.duration === "60") {
    } else {
    }
  };

  return (
    <div className="Calendar m0" id="calendly-dock">
      <div className="EventTypes-container">
        <div className="EventTypes-header m0">
          <h2 className="EventTypes-title m0">Booking Options </h2>

          <ul className="EventTypes-outer flex flex-wrap m0">
            {newTypes.map((t, i) => (
              <li className="EventTypes-inner" key={i}>
                <button
                  className={`EventTypes-button fs-main ff-b ${
                    type.duration === "60" && type.duration === t.duration
                      ? "EventTypes-button-active"
                      : type.duration === "90" && type.duration === t.duration
                      ? "EventTypes-button-sec-active"
                      : ""
                  }`}
                  onClick={() => handleEventTypeChange(t)}
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
          <button className="EventTypes-close ff-m" onClick={closeModal}>
            X
          </button>
        </div>
        <section className="EventTypes-section m0">
          <CalendarWithSlots type={type} />
        </section>
      </div>
    </div>
  );
}
