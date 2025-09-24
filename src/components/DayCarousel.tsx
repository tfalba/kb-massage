import React, { useMemo, useRef, useState, useEffect } from "react";
import { groupSlotsByNYDay, nycTime } from "../helpers/eventFormatter";

type Slot = { start_time: string; end_time: string; timezone?: string; scheduling_url: string };

export default function DayCarousel({
  slots,
  onSelect,
  title = "Available Times",
}: {
  slots: Slot[];
  onSelect?: (slot: Slot) => void;
  title?: string;
}) {
  const days = useMemo(() => groupSlotsByNYDay(slots), [slots]);
  const [i, setI] = useState(0);

  // Clamp index if days change
  useEffect(() => {
    console.log("Days changed, clamp index if needed", days.length, i);
    if (i >= days.length) setI(Math.max(0, days.length - 1));
  }, [days.length, i]);

  const canPrev = i > 0;
  const canNext = i < days.length - 1;
  const canPrevWeek = i > 6;
  const canNextWeek = i < days.length - 7;

  const goPrev = () => canPrev && setI(i - 1);
  const goNext = () => canNext && setI(i + 1);

  const goPrevWeek = () => canPrevWeek && setI(i - 6);
  const goNextWeek = () => canNextWeek && setI(i + 6);

  // Keyboard arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [i, days.length]);

  // Basic swipe
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goPrev();
      else goNext();
    }
    startX.current = null;
  };

  if (!days.length) {
    return <div className="day-carousel empty">No available times.</div>;
  }

  const current = days[i];

  return (
    <section className="day-carousel" aria-label={title}>
      <header className="dc-header">
         <button
          className="dc-nav"
          onClick={goPrevWeek}
          disabled={!canPrevWeek}
          aria-label="Previous week"
        >
          ‹‹
        </button>
        <button
          className="dc-nav"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous day"
        >
          ‹
        </button>
        <h4 className="dc-title">
          {title} <span className="dc-date">{current.heading}</span>
        </h4>
        <button
          className="dc-nav"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next day"
        >
          ›
        </button>
          <button
          className="dc-nav"
          onClick={goNextWeek}
          disabled={!canNextWeek}
          aria-label="Next week"
        >
          ››
        </button>
      </header>

      <div
        className="dc-panel"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        role="group"
        aria-roledescription="day view"
        aria-label={current.heading}
      >
        <ul className="dc-times">
          {current.items.map((s, idx) => (
            <li key={idx}>
              <button
                // className="dc-time"
                className="button button-time"
                onClick={() => onSelect?.(s)}
                aria-label={`${nycTime.format(new Date(s.start_time))} Eastern Time`}
              >
                {nycTime.format(new Date(s.start_time))}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="dc-dots" aria-label="Day navigation">
        {days.map((d, idx) => (
          <button
            key={d.key}
            onClick={() => setI(idx)}
            className={`dc-dot ${idx === i ? "active" : ""}`}
            aria-label={`Go to ${d.heading}`}
            aria-current={idx === i ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}
