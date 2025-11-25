import React, { useEffect, useState } from "react";

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
    <section className="bg-[radial-gradient(#d2ffaa45,#e6abab)] px-4 py-6 text-center sm:px-0 sm:py-8">
      <div
        className="m-[3vw] flex h-[clamp(220px,120vh,120vh)] max-w-full flex-col gap-[2vw] sm:h-[clamp(220px,40vh,460px)] sm:flex-row"
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
          const stateClass = isActive
            ? "flex-[3_1_0%] items-center justify-center sm:[flex:var(--num-items,10)_1_0%] sm:min-w-[var(--min-expanded,120px)]"
            : active === null
            ? "flex-[1_1_0%]"
            : "flex-[1_1_0%] opacity-90";
          return (
            <button
              key={i}
              className={`${spin ? "spin-y-3" : ""} relative flex min-w-[var(--min-collapsed,40px)] flex-1 basis-0 cursor-pointer overflow-hidden rounded-[14px] border-0 bg-transparent p-0 text-left transition-transform duration-150 ease-linear focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d4650] focus-visible:outline-offset-2 hover:-translate-y-[2px] ${stateClass}`}
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
              style={{
                animationDelay: `${randomDelay()}s`,
                transition:
                  "flex-basis var(--ag-duration,450ms) var(--ag-ease,cubic-bezier(0.2,0.7,0.2,1)), flex-grow var(--ag-duration,450ms) var(--ag-ease,cubic-bezier(0.2,0.7,0.2,1)), min-width var(--ag-duration,450ms) var(--ag-ease,cubic-bezier(0.2,0.7,0.2,1)), transform 160ms ease",
              }}
            >
              <img
                src={s.photo}
                alt={`Gallery ${i + 1}`}
                className={`block h-full w-full object-cover saturate-[0.95] transition duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                  isActive ? "saturate-105" : ""
                }`}
                style={{
                  transition:
                    "transform var(--ag-duration,450ms) var(--ag-ease,cubic-bezier(0.2,0.7,0.2,1)), filter 240ms ease",
                }}
              />
              <span
                className={`pointer-events-none ${
                  active !== null && isActive
                    ? "grid animate-gallery-fade-in"
                    : "hidden"
                } absolute top-1/2 -translate-y-1/2 place-content-center px-4 py-6 font-belleza text-[clamp(0.8rem,1.9vw,2.2rem)] font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)",
                }}
              >
                {s.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
