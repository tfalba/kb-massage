import React from "react";
import Modal from "react-modal";
import "./AccordionModal.css";
import { slideColors } from "../../data/ServicesData";

Modal.setAppElement("#root"); // for accessibility

type CardProps = {
  title: string;
  isOpen: boolean;
  idx: number;
  handleOpen: (idx: number | null) => void;
  children: React.ReactNode;
};

export default function AccordionModal({
  children,
  title,
  idx,
  handleOpen,
  isOpen,
}: CardProps) {
  return (
    <div
      className="acc-container"
      style={{
        left: `${10 + idx * 10}px`,
      }}
    >
      <button
        className="acc-button"
        onClick={() => handleOpen(idx)}
        style={{
          backgroundColor: slideColors[idx % 4],
        }}
      >
        <span className="acc-title ff-m">{title}</span>
      </button>

      {isOpen && (
        <div
          className="acc-modal-side"
          style={{ backgroundColor: slideColors[idx % 4] }}
          onClick={() => handleOpen(idx)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
