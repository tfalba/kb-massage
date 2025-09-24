import React, { useEffect, useMemo, useRef, useState } from "react";
import "./HomePhotoCarousel.css";
import photo1 from '../../assets/spa-photo-1.png';
import photo2 from '../../assets/spa-photo-2.png';
import photo3 from '../../assets/spa-photo-3.png';
import photo4 from '../../assets/spa-photo-4.png';
import photo5 from '../../assets/spa-photo-5.png';
import photo6 from '../../assets/spa-photo-6.png';
import photo7 from '../../assets/spa-photo-7.png';
import photo8 from '../../assets/spa-photo-8.png';




type Slide = {
  src: string;
  alt: string;
  caption?: string;
};
const slides: Slide[] = [
  {
    src: photo1,
    alt: 'photo1',
  },
  {src: photo2, alt: 'photo2'},
  {src: photo3, alt: 'photo3'},
  {src: photo4, alt: 'photo4'},
  {src: photo5, alt: 'photo5'},
  {src: photo6, alt: 'photo6'},
  {src: photo7, alt: 'photo7'},
  {src: photo8, alt: 'photo8'},
  // Add more image paths as needed
];

// const slides: Slide[] = [
//   {
//     src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1600&auto=format&fit=crop",
//     alt: "Calming massage room with warm lighting",
//     caption: "Relax. Reset. Restore."
//   },
//   {
//     src: "https://images.unsplash.com/photo-1604709177225-055f99402c01?q=80&w=1600&auto=format&fit=crop",
//     alt: "Therapist preparing for a sports massage",
//     caption: "Care for active bodies"
//   },
//   {
//     src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop",
//     alt: "Deep tissue technique close-up",
//     caption: "Release deep tension"
//   }
// ];

export default function HomePhotoCarousel({
  auto = true,
  intervalMs = 6000
}: {
  auto?: boolean;
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  const count = slides.length;
  const wrap = (n: number) => (n + count) % count;

  const canReduceMotion = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    []
  );

  // autoplay (pause on hover & when the tab is hidden)
  const hovering = useRef(false);
  useEffect(() => {
    if (!auto || canReduceMotion) return;
    let t: number | null = null;

    const tick = () => setI((x) => wrap(x + 1));
    const start = () => {
      if (!t && !hovering.current && !document.hidden) {
        t = window.setInterval(tick, intervalMs) as unknown as number;
      }
    };
    const stop = () => {
      if (t) {
        clearInterval(t);
        t = null;
      }
    };

    start();
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    return () => {
      stop();
    };
  }, [auto, intervalMs, canReduceMotion]);

  // swipe / drag
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ startX: number; dx: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, dx: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !trackRef.current) return;
    drag.current.dx = e.clientX - drag.current.startX;
    const pct = -i * 100 + (drag.current.dx / e.currentTarget.clientWidth) * 100;
    trackRef.current.style.transform = `translateX(${pct}%)`;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current || !trackRef.current) return;
    const dx = drag.current.dx;
    trackRef.current.style.transform = `translateX(${-i * 100}%)`;
    const threshold = e.currentTarget.clientWidth * 0.12; // 12% swipe
    if (dx < -threshold) setI(wrap(i + 1));
    else if (dx > threshold) setI(wrap(i - 1));
    drag.current = null;
  };

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setI((x) => wrap(x - 1));
      if (e.key === "ArrowRight") setI((x) => wrap(x + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured photos"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div
        className="hero-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={() => (drag.current = null)}
      >
        <div
          ref={trackRef}
          className={`hero-track ${canReduceMotion ? "no-anim" : ""}`}
          style={{ transform: `translateX(${-i * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <figure className="hero-slide" key={idx} aria-roledescription="slide" aria-label={`${idx + 1} of ${count}`}>
              <img
                src={s.src}
                alt={s.alt}
                loading="eager"
                fetchPriority={idx === 0 ? "high" : "low"}
              />
              {s.caption && <figcaption className="hero-caption">{s.caption}</figcaption>}
            </figure>
          ))}
        </div>

        <button
          className="hero-nav prev"
          aria-label="Previous"
          onClick={() => setI(wrap(i - 1))}
        >
          ‹
        </button>
        <button
          className="hero-nav next"
          aria-label="Next"
          onClick={() => setI(wrap(i + 1))}
        >
          ›
        </button>
      </div>

      <div className="hero-dots" role="tablist" aria-label="Slide navigation">
        {slides.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === i}
            aria-label={`Go to slide ${idx + 1}`}
            className={`hero-dot ${idx === i ? "active" : ""}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </section>
  );
}