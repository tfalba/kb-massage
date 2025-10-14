import React from "react";
import Modal from "react-modal";
import "./AccordionModal.css";
import { slideColors } from "../../data/ServicesData";

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
  return (
    <div
        className={`${isOpen ? "acc-container acc-container-open" : "acc-container"}`}
    //   className="acc-container"
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
            className={`${prevOpen>idx || prevOpen === -1 ? "acc-modal-side" : "acc-modal-side acc-side-right"}`}
        //   className="acc-modal-side"
          style={{ backgroundColor: slideColors[idx % 4] }}
          onClick={() => handleOpen(idx)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
