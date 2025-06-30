"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../modals/settings-modal";

export const ModalProvider = () => {
  const [isMounted, SetIsMounted] = useState(false);

  useEffect(() => {
    SetIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
    </>
  );
};
