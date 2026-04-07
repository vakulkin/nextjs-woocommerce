import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BillingAddress, ShippingAddress } from "@/lib/woocommerce/types";

const emptyBilling: BillingAddress = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
  email: "",
  phone: "",
};

const emptyShipping: ShippingAddress = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
};

interface CheckoutState {
  billing: BillingAddress;
  shipping: ShippingAddress;
  sameAsShipping: boolean;
  selectedPaymentMethod: string;
  updateBilling: (field: keyof BillingAddress, value: string) => void;
  updateShipping: (field: keyof ShippingAddress, value: string) => void;
  setSameAsShipping: (value: boolean) => void;
  setSelectedPaymentMethod: (method: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      billing: { ...emptyBilling },
      shipping: { ...emptyShipping },
      sameAsShipping: true,
      selectedPaymentMethod: "",

      updateBilling: (field, value) =>
        set((state) => ({ billing: { ...state.billing, [field]: value } })),

      updateShipping: (field, value) =>
        set((state) => ({ shipping: { ...state.shipping, [field]: value } })),

      setSameAsShipping: (value) => set({ sameAsShipping: value }),

      setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

      reset: () =>
        set({
          billing: { ...emptyBilling },
          shipping: { ...emptyShipping },
          sameAsShipping: true,
          selectedPaymentMethod: "",
        }),
    }),
    {
      name: "checkout-store",
      // Only persist data fields, not the action functions
      partialize: (state) => ({
        billing: state.billing,
        shipping: state.shipping,
        sameAsShipping: state.sameAsShipping,
        selectedPaymentMethod: state.selectedPaymentMethod,
      }),
    }
  )
);
