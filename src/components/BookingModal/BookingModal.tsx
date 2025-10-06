import Modal from "react-modal";
import "./BookingModal.css";
import { useState } from "react";
import { bookAppointment } from "../../api";
import { useModal } from "../../context/useModal";
import { groupBookingIntoStandard } from "../../helpers/eventFormatter";

Modal.setAppElement("#root"); // for accessibility

type Slot = { start_time: string; end_time: string; };

type Props = {
  open: boolean;
  onClose: () => void;
  slot: Slot;
  typeDuration: string;
};

export default function BookingModal({ open, onClose, slot, typeDuration }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // IMPORTANT: rootElement must be a real DOM node in your app (e.g., #root)
  //   const rootEl = document.getElementById("root")!;

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitting) onClose();
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!slot) return;
    if (!name) {
      alert(`❌ Name is required`);
      return;
    }
    if (!email) {
      {
        alert(`❌ Email is required`);
        return;
      }
    }
    try {
      const result = await bookAppointment(slot.start_time, slot.end_time, name, email, phone, typeDuration);
      alert(`✅ Booking confirmed! See it on Google Calendar: ${result.htmlLink}`);
      onClose();
      closeModal();

    } catch (e: any) {
      alert(`❌ Booking failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ position: 'fixed', top: '0', right: '0' }}>

      {open && (
        <div className="booking-backdrop" onClick={handleCancel}>
          <div className="booking-side" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#414b3a', margin: 0, padding: '0', display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 'calc(12px + 1.5vw)' }}>{typeDuration} Min Session
              <button style={{ fontSize: 'calc(10px + 1.5vw)', border: 'none', background: 'none', fontFamily: 'Montserrat', cursor: 'pointer' }} onClick={handleCancel}>X</button>
            </h2>
            <h4 style={{fontFamily: 'Montserrat', fontWeight: 400, color: '#414b3a'}}>{groupBookingIntoStandard(slot)}</h4>
            <form onSubmit={handleBooking} className='App-names'>
              <label className='Modal-name-label' htmlFor='name'>
                Name
              </label>
              <input value={name} placeholder='Name' type='text' onClick={() => setName('')} required onChange={(e) => setName(e.target.value)} className='App-name-input' id='name' />
              <label className='Modal-name-label' htmlFor='email'>
                Email
              </label>
              <input required={true} value={email} placeholder='Email' type='email' onClick={() => setEmail('')} onChange={(e) => setEmail(e.target.value)} className='App-name-input' id='email' />
              <label className='Modal-name-label' htmlFor='phone'>
                Phone
              </label>
              <input value={phone} placeholder='Phone' type='tel' onClick={() => setPhone('')} required onChange={(e) => setPhone(e.target.value)} className='App-name-input' id='phone' />
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <button type='button' onClick={handleCancel} className="App-button-submit">Cancel</button>

                <button type='submit' className={` ${typeDuration === '60' ? 'App-button-submit App-button-submit-60' : 'App-button-submit App-button-submit-90'}`}>Book Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
