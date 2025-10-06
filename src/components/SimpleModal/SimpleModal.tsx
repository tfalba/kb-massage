import React, { useState } from "react";
import Modal from "react-modal";
import "./SimpleModal.css";
import { useModal } from "../../context/useModal";


Modal.setAppElement("#root"); // for accessibility

export default function SimpleModal({ children }: { children: React.ReactNode }) {
    // const [isOpen, setIsOpen] = useState(false);
      const { isOpen, openModal, closeModal } = useModal();


    return (
        <div style={{ position: 'fixed', top: '0', right: '0'}}>
            <button onClick={openModal} style={{ backgroundColor: '#8ba87c', border: 'none', height: 'calc(max(12vw, 12vh, 105px))' }}>
                <span style={{
                    writingMode: 'vertical-rl', width: '40px', placeContent: 'center', fontSize: 'calc(8px + 1vw)', fontFamily: 'Montserrat'
                }}>Book Now</span>
            </button>

            {isOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-side" onClick={(e) => e.stopPropagation()}>
                        {/* <button onClick={() => setIsOpen(false)} style={{ backgroundColor: '#8ba87c', border: 'none', height: '100%' }}><span style={{
                            writingMode: 'vertical-rl', width: '40px', placeContent: 'center', fontSize: 'calc(10px + 1vw)', fontFamily: 'Montserrat'
                        }}>Book Now</span></button> */}
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
