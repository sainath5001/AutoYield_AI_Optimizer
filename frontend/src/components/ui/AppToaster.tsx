"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      theme="dark"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "bg-zinc-900 border border-zinc-700 text-zinc-100 shadow-xl",
        },
      }}
    />
  );
}
