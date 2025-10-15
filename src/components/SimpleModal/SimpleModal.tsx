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
    <div className="modal-booking-cont">
      <button onClick={openModal} className="modal-booking-button">
        <span className="modal-booking-text ff-m">Book Now</span>
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
