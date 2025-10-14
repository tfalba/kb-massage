import React, { useEffect, useState } from "react";
import "./AccordionGallery.css";

export default function AccordionGallery({
  minExpanded = 120, // px: minimum width when expanded
  minCollapsed = 80, // px: minimum width for others
  expandable = true,
  slides,
  spin = true,
  manualTrip = false,
}: {
  minExpanded?: number;
  minCollapsed?: number;
  expandable?: boolean;
  slides: { photo: string; text: string }[];
  spin?: boolean;
  manualTrip?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [manual, setManual] = useState(manualTrip);
  const randomDelay = () => {
    return Math.random() * 3;
  };

  useEffect(() => {
    if (!expandable) return;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      // setManual(false);

      interval = setInterval(() => {
        // pick a random index different from current
        if (manual) return; // stop auto if user has clicked
        setActive((prev) => {
          let next = prev;
          while (next === prev) {
            if (prev === null) {
              next = 0;
            } else {
              next = (prev + 1) % slides.length;
            }
            // next = Math.floor(Math.random() * images.length);
          }
          return next;
        });
      }, 3500); // every 3.5 seconds
    }, 4000); // initial delay 4s

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }; // cleanup on unmount
  }, [manual]);

  return (
    <section className="PhotoGrid-section">
      <div
        className="ag flex-col"
        style={
          {
            "--min-expanded": `${minExpanded}px`,
            "--min-collapsed": `${minCollapsed}px`,
            "--num-items": slides.length,
          } as React.CSSProperties
        }
        role="list"
        aria-label="Accordion photo gallery"
      >
        {slides.map((s, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              className={`${spin ? "spin-y-3" : ""} ag-item ${
                isActive
                  ? "is-active"
                  : active === null
                  ? "is-idle"
                  : "is-collapsed"
              }`}
              onClick={
                expandable
                  ? () => {
                      setManual(true);
                      setActive(isActive ? null : i);
                    }
                  : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "Escape") setActive(null);
              }}
              role="listitem"
              aria-pressed={isActive}
              style={{ animationDelay: `${randomDelay()}s` }}
            >
              <img src={s.photo} alt={`Gallery ${i + 1}`} />
              <span
                className={`ag-label ${
                  active !== null && isActive ? "is-active" : "is-collapsed"
                }`}
              >
                {" "}
                {s.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
