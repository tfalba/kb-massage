import React, { useState } from "react";
import Modal from "react-modal";
import "./AccordionModal.css";
import { slideColors } from "../../data/ServicesData";


Modal.setAppElement("#root"); // for accessibility

type CardProps = {
  title: string;
   isOpen: boolean;
   idx: number;
   handleOpen: (idx: number | null) => void;
//   onClose: () => void;
  // any other props
  children: React.ReactNode;
};

export default function AccordionModal({ children, title, idx, handleOpen, isOpen} : CardProps) {
    // const [isOpen, setIsOpen] = useState(false);
    const [localIdx, setlocalIdx] = useState(idx);
    return (
        <div style={{ display: 'flex', top: '0', left: `${10 + idx * 10}px`, height: '62vh'}}>
            <button onClick={() => handleOpen(idx)} style={{ backgroundColor: slideColors[idx % 4], border: 'none', height: '100%', flex: '1' }}><span style={{
                writingMode: 'vertical-rl', width: '60px', placeContent: 'center', fontSize: 'calc(10px + 1.3vw)', fontFamily: 'Montserrat', color: 'white', fontWeight: '200'
            }}>{title}</span></button>

            {isOpen && (
                <div className="acc-modal-side" style={{backgroundColor: slideColors[idx % 4]}} onClick={() => handleOpen(idx)}>
                  
                        {children}
                    </div>)
                
            }
        </div>
    );
}
