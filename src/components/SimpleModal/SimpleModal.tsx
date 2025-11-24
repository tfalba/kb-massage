import React from "react";
import Modal from "react-modal";
import { useModal } from "../../context/useModal";

Modal.setAppElement("#root"); // for accessibility

export default function SimpleModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="fixed right-0 top-0">
      <button
        onClick={openModal}
        className="bg-brand-sage text-white"
        style={{ height: "calc(max(12vw, 12vh, 105px))" }}
      >
        <span className="grid w-[max(5vw,5vh)] place-content-center font-montserrat text-[clamp(0.9rem,1vw,1.1rem)] font-semibold tracking-widest text-white [writing-mode:vertical-rl]">
          Book Now
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex justify-end bg-black/40"
          onClick={closeModal}
        >
          <div
            className="flex max-h-screen w-full max-w-[1400px] flex-col overflow-y-auto bg-white shadow-accordion-panel animate-booking-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
