import { create } from "zustand"

export interface UIState {
  isMobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
}))
