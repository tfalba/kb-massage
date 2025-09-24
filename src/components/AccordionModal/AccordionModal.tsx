import React, { useState } from "react";
import Modal from "react-modal";
import "./AccordionModal.css";


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
        <div style={{ display: 'flex', top: '0', left: `${10 + idx * 10}px`, height: '50vh'}}>
            <button onClick={() => handleOpen(idx)} style={{ backgroundColor: idx === 0 ? '#414b3b' :  idx === 1 ? '#ab8742' : idx === 2 ? '#8ca87c' : '#5d5340', border: 'none', height: '100%', flex: '1' }}><span style={{
                writingMode: 'vertical-rl', width: '40px', placeContent: 'center', fontSize: 'calc(10px + 1vw)', fontFamily: 'Montserrat', color: 'white', fontWeight: '200'
            }}>{title}</span></button>

            {isOpen && (
                <div className="acc-modal-side" style={{backgroundColor: idx === 0 ? '#414b3b' :  idx === 1 ? '#ab8742' : idx === 2 ? '#8ca87c' : '#5d5340'}} onClick={() => handleOpen(idx)}>
                    {/* <div className="acc-modal-side" onClick={(e) => e.stopPropagation()}> */}
                        {/* <button onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: '#8ba87c', border: 'none', height: '100%' }}><span style={{
                            writingMode: 'vertical-rl', width: '40px', placeContent: 'center', fontSize: 'calc(10px + 1vw)', fontFamily: 'Montserrat'
                        }}>{title}</span></button> */}
                        {children}
                    </div>
                // {/* </div> */}
            )}
        </div>
    );
}
