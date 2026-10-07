import { create } from 'zustand';

interface SuccessOverlayState {
  open: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  onDismiss: () => void;
  show: (opts: { title: string; message: string; buttonLabel: string; onDismiss: () => void }) => void;
  hide: () => void;
}

export const useSuccessOverlay = create<SuccessOverlayState>((set) => ({
  open: false,
  title: '',
  message: '',
  buttonLabel: 'OK',
  onDismiss: () => {},
  show: (opts) => set({ open: true, ...opts }),
  hide: () => set({ open: false }),
}));

export function showSuccessOverlay(opts: {
  title: string;
  message: string;
  buttonLabel: string;
  onDismiss: () => void;
}) {
  useSuccessOverlay.getState().show(opts);
}
