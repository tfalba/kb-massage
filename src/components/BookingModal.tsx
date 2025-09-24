import { PopupModal } from "react-calendly";

type Props = {
  open: boolean;
  onClose: () => void;
  schedulingUrl: string;   // e.g., https://calendly.com/yourname/30min
};

export default function BookingModal({ open, onClose, schedulingUrl }: Props) {
  // IMPORTANT: rootElement must be a real DOM node in your app (e.g., #root)
  const rootEl = document.getElementById("root")!;

  return (
    <PopupModal
      url={schedulingUrl}
      open={open}
      onModalClose={onClose}
      rootElement={rootEl}
      /*
      Optional cosmetics:
      /*
      prefill={{ name: "Guest Name", email: "guest@example.com" }}
      pageSettings={{ primaryColor: "0D4650", textColor: "000000", backgroundColor: "ffffff" }}
      */
    />
  );
}