import React from "react";
import Modal from "react-modal";
import "./SimpleModal.css";
import { useModal } from "../../context/useModal";

Modal.setAppElement("#root"); // for accessibility

export default function SimpleModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div style={{ position: "fixed", top: "0", right: "0" }}>
      <button
        onClick={openModal}
        style={{
          backgroundColor: "#8ba87c",
          border: "none",
          height: "calc(max(12vw, 12vh, 105px))",
          textDecoration: "none",
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            // width: "40px",
            width: "4vw",
            placeContent: "center",
            fontSize: "calc(10px + .8vw)",
            fontFamily: "Montserrat",
            textDecoration: "none",
            color: "white",
            fontWeight: 600,
          }}
        >
          Book Now
        </span>
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-side" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
