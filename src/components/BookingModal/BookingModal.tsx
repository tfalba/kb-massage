import Modal from "react-modal";
import { useEffect, useRef, useState } from "react";
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
  const { closeModal, scrollOverlayToTop } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      scrollOverlayToTop();
    }
  }, [open, scrollOverlayToTop]);

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
    "rounded-[12px]  px-4 py-2 font-belleza text-[clamp(0.9rem,1vw,1.2rem)] shadow-sm transition-colors duration-200";

  return (
    <div
      className="fixed inset-0 z-[1000] min-h-full h-fit flex justify-end bg-black/40"
      onClick={handleCancel}
    >
      <div
        ref={modalScrollRef}
        className="flex min-h-full h-fit w-full max-w-[480px] flex-col items-center overflow-y-auto border-l border-brand-sage/30 bg-gradient-to-b from-white via-brand-cream to-brand-mist px-[2vw] pb-[6vw] pt-[2vw] shadow-booking-panel animate-booking-slide-in sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 flex w-full items-center justify-between font-montserrat text-[clamp(1.2rem,2vw,2.2rem)] text-brand-forest">
          {typeDuration} Min Session
          <button
            className="cursor-pointer border-0 bg-transparent font-montserrat text-[clamp(1.8rem,2.6vw,2.3rem)] text-brand-forest"
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
          className={`mt-2 flex w-full max-w-[380px] flex-col rounded-[18px] bg-white p-[2vw] ${typeDuration === "60" ? "shadow-glow" : "shadow-glowBlue"}`}
        >
          <label
            className="mt-3 text-left font-belleza text-[clamp(1.1rem,1.5vw,2.2rem)] text-brand-forest"
            htmlFor="name"
          >
            Name
          </label>
          <input
            value={name}
            placeholder="enter name"
            type="text"
            onClick={() => setName("")}
            required
            onChange={(e) => setName(e.target.value)}
            className="h-[30px] border border-brand-forest/20 bg-brand-cream rounded-[8px] pl-2 font-belleza text-[clamp(0.9rem,1vw,1.1rem)] text-brand-forest outline-none focus:ring-2 focus:ring-brand-forest/30"
            id="name"
          />
          <label
            className="mt-5 text-left font-belleza text-[clamp(1.1rem,1.5vw,2.2rem)] text-brand-forest"
            htmlFor="email"
          >
            Email
          </label>
          <input
            required
            value={email}
            placeholder="enter email"
            type="email"
            onClick={() => setEmail("")}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[30px] border border-brand-forest/20 bg-brand-cream rounded-[8px] pl-2 font-belleza text-[clamp(0.9rem,1vw,1.1rem)] text-brand-forest outline-none focus:ring-2 focus:ring-brand-forest/30"
            id="email"
          />
          <label
            className="mt-5 text-left font-belleza text-[clamp(1.1rem,1.5vw,2.2rem)] text-brand-forest"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            value={phone}
            placeholder="enter phone"
            type="tel"
            onClick={() => setPhone("")}
            required
            onChange={(e) => setPhone(e.target.value)}
            className="h-[30px] border border-brand-forest/20 bg-brand-cream pl-2 rounded-[8px] font-belleza text-[clamp(0.9rem,1vw,1.1rem)] text-brand-forest outline-none focus:ring-2 focus:ring-brand-forest/30"
            id="phone"
          />
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={handleCancel}
              className={`${buttonBase} bg-black/5 border ${typeDuration === "60" ? "border-brand-sage text-brand-sage" : "border-brand-ocean text-brand-ocean"}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${buttonBase} ${
                typeDuration === "60"
                  ? "bg-brand-sage text-white"
                  : "bg-brand-ocean text-white"
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
