"use client";

import { createContext, useContext, useState } from "react";

interface ToastContextType {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState<boolean>(true);

  return (
    <ToastContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};