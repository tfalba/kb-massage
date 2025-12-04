import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  registerScrollContainer: (node: HTMLDivElement | null) => void;
  scrollOverlayToTop: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollContainer, setScrollContainer] =
    useState<HTMLDivElement | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const registerScrollContainer = useCallback((node: HTMLDivElement | null) => {
    setScrollContainer(node);
  }, []);
  const scrollOverlayToTop = useCallback(() => {
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollContainer]);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        registerScrollContainer,
        scrollOverlayToTop,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
