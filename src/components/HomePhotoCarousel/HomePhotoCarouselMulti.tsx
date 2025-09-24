import React, { useEffect, useMemo, useRef, useState } from "react";
import "./HomePhotoCarouselMulti.css";
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

export default function HomePhotoCarouselMulti() {
  const perView = usePerView();                     // 1 / 3 / 4
  const pages = Math.max(1, Math.ceil(slides.length / perView));
  const [page, setPage] = useState(0);

  // clamp when perView changes
  useEffect(() => {
    if (page > pages - 1) setPage(pages - 1);
  }, [pages, page]);

  // swipe/drag
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ startX: number; dx: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, dx: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !trackRef.current) return;
    drag.current.dx = e.clientX - drag.current.startX;
    const pct = -page * 100 + (drag.current.dx / e.currentTarget.clientWidth) * 100;
    trackRef.current.style.transform = `translateX(${pct}%)`;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current || !trackRef.current) return;
    const { dx } = drag.current;
    trackRef.current.style.transform = `translateX(${-page * 100}%)`;
    const threshold = e.currentTarget.clientWidth * 0.12; // 12% swipe
    if (dx < -threshold && page < pages - 1) setPage(page + 1);
    else if (dx > threshold && page > 0) setPage(page - 1);
    drag.current = null;
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPage(p => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setPage(p => Math.min(pages - 1, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages]);

  const canPrev = page > 0;
  const canNext = page < pages - 1;

  return (
    <section className="hpm" aria-roledescription="carousel" aria-label="Photo gallery">
      <header className="hpm-head">
        <h2 className="hpm-title">Welcome</h2>
        <div className="hpm-ctrls">
          <button className="hpm-nav" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={!canPrev} aria-label="Previous">‹</button>
          <button className="hpm-nav" onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={!canNext} aria-label="Next">›</button>
        </div>
      </header>

      <div
        className="hpm-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={() => (drag.current = null)}
      >
        <div
          ref={trackRef}
          className="hpm-track"
          style={{
            // translate one full "page" (viewport width) at a time
            transform: `translateX(${-page * 100}%)`,
            // tell CSS how many cards to fit per view
            // (used to compute slide width)
            // @ts-ignore custom property
            "--per-view": perView,
          } as React.CSSProperties}
        >
          {slides.map((s, i) => (
            <figure className="hpm-slide" key={i} aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
              <img src={s.src} alt={s.alt} loading={i < perView ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
      </div>

      <footer className="hpm-dots" aria-label="Page navigation">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            className={`hpm-dot ${i === page ? "active" : ""}`}
            aria-label={`Go to page ${i + 1}`}
            aria-current={i === page}
            onClick={() => setPage(i)}
          />
        ))}
      </footer>
    </section>
  );
}

function usePerView() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const m3 = window.matchMedia("(min-width: 768px)");   // medium
    const m4 = window.matchMedia("(min-width: 1200px)");  // large
    const update = () => setN(m4.matches ? 4 : m3.matches ? 3 : 1);
    update();
    m3.addEventListener("change", update);
    m4.addEventListener("change", update);
    return () => {
      m3.removeEventListener("change", update);
      m4.removeEventListener("change", update);
    };
  }, []);
  return n;
}