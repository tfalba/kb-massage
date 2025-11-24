import React, { useEffect, useState } from "react";

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
    <section className="flex flex-col items-start bg-brand-sand py-8">
      <h2 className="pl-[4vw] font-montserrat text-[clamp(1.8rem,2.6vw,3rem)] font-medium text-brand-earth">
        Client Testimonials
      </h2>

      <div
        className="mx-[6vw] my-[3vw] flex h-[clamp(220px,80vh,650px)] max-w-full flex-col gap-[5vw] sm:mx-[3vw] sm:h-[clamp(260px,40vh,460px)] sm:flex-row sm:gap-[2vw]"
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
          const stateClass = isActive
            ? "flex-[var(--num-items,10)_1_0%] items-center justify-center sm:min-w-[var(--min-expanded,120px)]"
            : active === null
            ? "flex-[1_1_0%]"
            : "flex-[1_1_0%] opacity-90";
          return (
            <button
              key={i}
              className={`${
                spin ? "animate-review-spin-x sm:animate-review-spin-y" : ""
              } relative flex min-w-[var(--min-collapsed,40px)] flex-1 basis-0 cursor-pointer overflow-hidden rounded-[14px] border-0 bg-transparent p-0 text-left shadow-sm transition-transform duration-150 ease-linear focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d4650] focus-visible:outline-offset-2 hover:-translate-y-[2px] ${stateClass} ${
                isActive
                  ? "border-[3px] border-brand-copper/40 bg-brand-sage/10"
                  : ""
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
              style={{
                animationDelay: `${randomDelay()}s`,
                transition:
                  "flex-basis var(--rg-duration,450ms) var(--rg-ease,cubic-bezier(0.2,0.7,0.2,1)), flex-grow var(--rg-duration,450ms) var(--rg-ease,cubic-bezier(0.2,0.7,0.2,1)), min-width var(--rg-duration,450ms) var(--rg-ease,cubic-bezier(0.2,0.7,0.2,1)), transform 160ms ease",
                transformStyle: spin ? "preserve-3d" : undefined,
              }}
            >
              {active === i ? (
                <span
                  className={`pointer-events-none grid place-content-center px-4 py-5 font-montserrat text-[min(calc(0.5rem+1vw),calc(0.5rem+1.2vh))] text-brand-earth opacity-0 animate-gallery-fade-in`}
                  style={{ animationDelay: "0.5s" }}
                >
                  {s.text}
                </span>
              ) : (
                <img
                  src={s.photo}
                  alt={`Gallery ${i + 1}`}
                  className="block h-full w-full object-cover saturate-[0.95] transition duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                  style={{
                    transition:
                      "transform var(--rg-duration,450ms) var(--rg-ease,cubic-bezier(0.2,0.7,0.2,1)), filter 240ms ease",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
