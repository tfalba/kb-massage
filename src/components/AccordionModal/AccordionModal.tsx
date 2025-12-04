import React from "react";
import Modal from "react-modal";
import { slideColorThemes, slideImages } from "../../data/ServicesData";

Modal.setAppElement("#root"); // for accessibility

type CardProps = {
  title: string;
  isOpen: boolean;
  prevOpen: number;
  idx: number;
  handleOpen: (idx: number) => void;
  children: React.ReactNode;
};

export default function AccordionModal({
  children,
  title,
  idx,
  handleOpen,
  isOpen,
  prevOpen,
}: CardProps) {
  const colorClass =
    slideColorThemes[idx % slideColorThemes.length] ?? "bg-brand-forest";
  const containerBase =
    "flex top-0 h-auto flex-col flex-1 transition-accordion duration-[850ms] ease-accordion min-h-auto sm:h-[min(630px,140vh)] sm:max-h-[800px] md:flex-row";
  const containerState = isOpen ? "flex-[12]" : "";
  const panelAnimation =
    prevOpen > idx
      ? "md:animate-accordion-slide-in"
      : "md:animate-accordion-slide-in-right";

  return (
    <div
      className={`${containerBase} ${containerState}`}
      style={{
        left: `${10 + idx * 10}px`,
      }}
    >
      <button
        className={`${colorClass} flex h-full flex-1 items-center justify-evenly border border-transparent p-[1px] text-white transition-all duration-300 hover:border-white/40 hover:p-0 sm:flex-col`}
        onClick={() => handleOpen(idx)}
      >
        <span
          className="grid flex-[2] place-content-center font-montserrat text-[clamp(0.85rem,2vw,1.8rem)] font-extralight text-white transition-colors hover:font-semibold md:[writing-mode:vertical-rl]"
        >
          {title}
        </span>
        <div className="flex flex-1 items-center justify-center p-2">
          <img
            className="w-[max(5vw,5vh)]"
            src={slideImages[idx].img}
            alt={`${title} icon`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className={`${colorClass} relative flex h-full flex-[6] shadow-accordion-panel animate-accordion-slide-up ${panelAnimation}`}
          style={{ minWidth: "var(--min-collapsed, 40px)" }}
          onClick={() => handleOpen(idx)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
