import React, { useEffect, useRef } from "react";
import Modal from "react-modal";
import { useModal } from "../../context/useModal";

Modal.setAppElement("#root"); // for accessibility

export default function SimpleModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openModal, closeModal, registerScrollContainer } = useModal();
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      registerScrollContainer(modalScrollRef.current);
    } else {
      registerScrollContainer(null);
    }
    return () => registerScrollContainer(null);
  }, [isOpen, registerScrollContainer]);

  return (
    <div className="fixed right-0 top-0">
      <button
        onClick={openModal}
        className="bg-brand-sage text-white"
        style={{ height: "calc(max(12vw, 14vh, 110px))" }}
      >
        <span className="grid w-[max(5vw,5vh)] place-content-center font-montserrat text-[clamp(1rem,1.2vw,1.6rem)] font-semibold tracking-widest text-white [writing-mode:vertical-rl]">
          Book Now
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex justify-end bg-black/40"
          onClick={closeModal}
        >
          <div
            ref={modalScrollRef}
            className="flex max-h-screen w-full max-w-[1400px] flex-col overflow-y-auto shadow-accordion-panel animate-booking-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
