"use client";
import React, { useCallback, useContext, useState } from "react";
import ToastContainer from "./ToastContainer";
const ToastContext = React.createContext();
export const useToast = () => useContext(ToastContext);
const ToastProvider = ({children}) => {
  const [toasts, setToasts] = useState([]);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const addToast = useCallback((type, content, duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, content }]);
    setTimeout(() => removeToast(id), duration);
  }, []);
  return (
    <ToastContext.Provider
      value={{ addToast, removeToast }}
    >
        {children}
        <ToastContainer toasts = {toasts}/>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
