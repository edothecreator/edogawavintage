"use client";

import { create } from "zustand";

let hideTimer: ReturnType<typeof setTimeout> | null = null;

type CartFeedbackState = {
  open: boolean;
  productName: string;
  quantity: number;
  /** Increments on each add — drives cart badge micro-animation. */
  bump: number;
  show: (productName: string, quantity?: number) => void;
  dismiss: () => void;
};

export const useCartFeedbackStore = create<CartFeedbackState>((set, get) => ({
  open: false,
  productName: "",
  quantity: 1,
  bump: 0,
  dismiss: () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    set({ open: false });
  },
  show: (productName, quantity = 1) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({
      open: true,
      productName,
      quantity,
      bump: get().bump + 1,
    });
    hideTimer = setTimeout(() => {
      set({ open: false });
      hideTimer = null;
    }, 3400);
  },
}));

/** Call after a successful `add()` so shoppers get clear feedback on phones. */
export function notifyCartItemAdded(productName: string, quantity = 1) {
  useCartFeedbackStore.getState().show(productName, quantity);
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(12);
    } catch {
      /* ignore */
    }
  }
}
