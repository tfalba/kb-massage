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

  const buttonBase =
    "rounded-[12px] border-2  px-[1rem] py-[.5rem] font-belleza text-[clamp(0.95rem,1.2vw,1.4rem)] text-brand-cream transition-colors duration-300";

  return (
    <div
      id="calendly-dock"
      className="flex w-full justify-center bg-brand-cream px-[2vw] py-[2vw]"
    >
      <div className="w-full max-w-5xl rounded-[18px] bg-white shadow-lg">
        <div className="flex flex-col gap-4 rounded-t-[18px] bg-brand-cream p-[2vw] text-brand-forest md:flex-row md:items-start md:justify-between">
          <h2 className="m-0 text-left font-montserrat font-200 text-[clamp(1.5rem,2.4vw,3rem)] text-brand-forest [flex:1.5]">
            Booking Options
          </h2>

          <ul className="flex min-h-[6vh] flex-wrap list-none justify-end gap-2 pl-0 pr-[4vw] [flex:1.3]">
            {newTypes.map((t) => {
              const isActive = type.duration === t.duration;
              const buttonTypeBase = t.duration === "60" ? "border-[#6da049] bg-brand-sage/90 hover:bg-brand-sage/70" : "border-[#5dacd6] bg-brand-ocean/90 hover:bg-brand-ocean/70"
              const activeClass =
                t.duration === "60"
                  ? "border-[#6da049] bg-brand-sage text-white"
                  : "border-[#5dacd6] bg-brand-ocean text-white";

              return (
                <li className="m-[0.5vw]" key={t.duration}>
                  <button
                    className={`${buttonBase} ${buttonTypeBase} ${isActive ? activeClass : ""}`}
                    onClick={() => handleEventTypeChange(t)}
                  >
                    {t.name}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            className="fixed top-0 right-[4vw] border-0 bg-transparent font-montserrat text-[clamp(1.8rem,2.6vw,2.3rem)] text-brand-forest transition-colors duration-200 hover:text-brand-copper"
            onClick={closeModal}
            aria-label="Close booking options"
          >
            ×
          </button>
        </div>
        <section className="rounded-b-[18px] bg-white pb-[2vw]">
          <CalendarWithSlots type={type} />
        </section>
      </div>
    </div>
  );
}
