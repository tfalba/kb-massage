import Modal from "react-modal";
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

  if (!open) return null;

  const buttonBase =
    "rounded-[12px] border border-transparent px-4 py-2 font-belleza text-[clamp(0.9rem,1vw,1.2rem)] text-white shadow-sm transition-colors duration-200";

  return (
    <div
      className="fixed inset-0 z-[1000] flex justify-end bg-[#4140406e]"
      onClick={handleCancel}
    >
      <div
        className="flex max-h-screen w-full max-w-[420px] flex-col items-center overflow-y-auto bg-brand-mist px-[2vw] pb-[4vw] pt-[2vw] shadow-booking-panel animate-booking-slide-in sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 flex w-full items-center justify-between font-montserrat text-[clamp(1.2rem,2vw,2.2rem)] text-brand-forest">
          {typeDuration} Min Session
          <button
            className="cursor-pointer border-0 bg-transparent font-montserrat text-[clamp(1rem,1.5vw,1.8rem)] text-brand-forest"
            onClick={handleCancel}
            type="button"
          >
            ×
          </button>
        </h2>
        <h4 className="mt-2 font-montserrat text-lg font-normal text-brand-forest">
          {groupBookingIntoStandard(slot)}
        </h4>
        <form
          onSubmit={handleBooking}
          className="mt-2 flex w-full max-w-[380px] flex-col px-[4vw]"
        >
          <label
            className="mt-5 text-left font-belleza text-[clamp(0.95rem,1vw,1.2rem)] text-brand-forest"
            htmlFor="name"
          >
            Name
          </label>
          <input
            value={name}
            placeholder="Name"
            type="text"
            onClick={() => setName("")}
            required
            onChange={(e) => setName(e.target.value)}
            className="h-[30px] border-0 bg-white pl-2 font-belleza text-[clamp(0.9rem,1vw,1.1rem)] text-brand-forest outline-none focus:ring-2 focus:ring-brand-forest/30"
            id="name"
          />
          <label
            className="mt-5 text-left font-belleza text-[clamp(0.95rem,1vw,1.2rem)] text-brand-forest"
            htmlFor="email"
          >
            Email
          </label>
          <input
            required
            value={email}
            placeholder="Email"
            type="email"
            onClick={() => setEmail("")}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[30px] border-0 bg-white pl-2 font-belleza text-[clamp(0.9rem,1vw,1.1rem)] text-brand-forest outline-none focus:ring-2 focus:ring-brand-forest/30"
            id="email"
          />
          <label
            className="mt-5 text-left font-belleza text-[clamp(0.95rem,1vw,1.2rem)] text-brand-forest"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            value={phone}
            placeholder="Phone"
            type="tel"
            onClick={() => setPhone("")}
            required
            onChange={(e) => setPhone(e.target.value)}
            className="h-[30px] border-0 bg-white pl-2 font-belleza text-[clamp(0.9rem,1vw,1.1rem)] text-brand-forest outline-none focus:ring-2 focus:ring-brand-forest/30"
            id="phone"
          />
          <div className="mt-10 flex items-center justify-evenly gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className={`${buttonBase} bg-black/20`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${buttonBase} ${
                typeDuration === "60"
                  ? "bg-[#7cac5b]"
                  : "bg-[#6db0d4ec]"
              }`}
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
