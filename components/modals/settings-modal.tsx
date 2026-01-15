"use client";

import { useSettings } from "@/hooks/use-settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { ModeToggle } from "../mode-toggle";

export const SettingsModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className=" border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className=" flex items-center justify-between">
          <div className=" flex flex-col gap-y-1">
            <DialogTitle>
              <Label>Appearance</Label>
            </DialogTitle>
            <span className="text-[0.8rem] text-muted-foreground ">
              Customize how NoteFlow looks on your devise
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
