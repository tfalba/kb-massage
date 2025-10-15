import React, { useEffect, useState } from "react";
import "./ReviewGallery.css";

export default function ReviewGallery({
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
      }, 4500); // every 4.5 seconds
    }, 4500); // initial delay 4s

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }; // cleanup on unmount
  }, [manual]);

  return (
    <section className="rg-section">
      <h2 style={{ color: "#5d5340", paddingLeft: "4vw" }} className="rg-title">
        Client Testimonials
      </h2>

      <div
        className="rg"
        style={
          {
            "--min-expanded": `${minExpanded}px`,
            "--min-collapsed": `${minCollapsed}px`,
            "--num-items": slides.length / 2,
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
              className={`${spin ? "rg-spin-y-3" : ""} rg-item ${
                isActive
                  ? "is-active"
                  : active === null
                  ? "is-idle"
                  : "is-collapsed"
              }`}
              onMouseEnter={() => {
                setManual(true);
                setActive(i);
              }}
              onMouseLeave={() => {
                setManual(false);
                setActive(null);
              }}
              role="listitem"
              aria-pressed={isActive}
              style={{ animationDelay: `${randomDelay()}s` }}
            >
              {active === i ? (
                <span
                  className={`rg-label ff-m ${
                    active !== null && isActive ? "is-active" : "is-collapsed"
                  }`}
                >
                  {" "}
                  {s.text}
                </span>
              ) : (
                <img src={s.photo} alt={`Gallery ${i + 1}`} />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
