import Modal from "react-modal";
import "./BookingModal.css";
import { useState } from "react";
import { bookAppointment } from "../../api";
import { useModal } from "../../context/useModal";
import { groupBookingIntoStandard } from "../../helpers/eventFormatter";

Modal.setAppElement("#root"); // for accessibility

type Slot = { start_time: string; end_time: string };

type Props = {
  open: boolean;
  onClose: () => void;
  slot: Slot;
  typeDuration: string;
};

export default function BookingModal({
  open,
  onClose,
  slot,
  typeDuration,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // IMPORTANT: rootElement must be a real DOM node in your app (e.g., #root)
  //   const rootEl = document.getElementById("root")!;

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitting) onClose();
  };

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
      const result = await bookAppointment(
        slot.start_time,
        slot.end_time,
        name,
        email,
        phone,
        typeDuration
      );
      alert(
        `✅ Booking confirmed! See it on Google Calendar: ${result.htmlLink}`
      );
      onClose();
      closeModal();
    } catch (e: any) {
      alert(`❌ Booking failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-container">
      {open && (
        <div className="booking-backdrop" onClick={handleCancel}>
          <div
            className="booking-side flex-col aic"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="booking-title m0">
              {typeDuration} Min Session
              <button className="booking-close ff-m" onClick={handleCancel}>
                X
              </button>
            </h2>
            <h4 className="booking-sub-title ff-m">
              {groupBookingIntoStandard(slot)}
            </h4>
            <form onSubmit={handleBooking} className="booking-names flex-col">
              <label className="booking-name-label" htmlFor="name">
                Name
              </label>
              <input
                value={name}
                placeholder="Name"
                type="text"
                onClick={() => setName("")}
                required
                onChange={(e) => setName(e.target.value)}
                className="booking-name-input"
                id="name"
              />
              <label className="booking-name-label" htmlFor="email">
                Email
              </label>
              <input
                required={true}
                value={email}
                placeholder="Email"
                type="email"
                onClick={() => setEmail("")}
                onChange={(e) => setEmail(e.target.value)}
                className="booking-name-input"
                id="email"
              />
              <label className="booking-name-label" htmlFor="phone">
                Phone
              </label>
              <input
                value={phone}
                placeholder="Phone"
                type="tel"
                onClick={() => setPhone("")}
                required
                onChange={(e) => setPhone(e.target.value)}
                className="booking-name-input"
                id="phone"
              />
              <div className="booking-button-cont">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="booking-button-submit"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={` ${
                    typeDuration === "60"
                      ? "booking-button-submit booking-button-submit-60"
                      : "booking-button-submit booking-button-submit-90"
                  }`}
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
