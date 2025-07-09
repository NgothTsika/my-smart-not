"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      position="bottom-right" // 👈 Set global position here
      toastOptions={{
        duration: 3000, // default duration for all toasts
      }}
    />
  );
};

export default ToasterProvider;
