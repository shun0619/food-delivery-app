"use client";

import { Menu } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ModalContextType {
  isOpen: boolean;
  selectedItem: Menu | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  openModal: (menu: Menu) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null);

  const openModal = (menu: Menu) => {
    setIsOpen(true);
    setSelectedItem(menu);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, selectedItem, setIsOpen, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalはModalProvider内で使用する必要があります");
  }
  return context;
};
