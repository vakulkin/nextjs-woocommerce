"use server";

import {
  addToCartOnServer,
  updateCartItemOnServer,
  removeCartItemOnServer,
  getCartFromServer,
  checkoutOnServer,
  selectShippingRateOnServer,
  updateCustomerOnServer,
} from "@/lib/woocommerce/api";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  RemoveCartItemSchema,
  SelectShippingRateSchema,
  PartialAddressSchema,
} from "@/lib/validation/schemas";
import type { WooCart, WooCheckoutOrder, BillingAddress, ShippingAddress } from "@/lib/woocommerce/types";

function extractCartToken(response: Response): string | null {
  return response.headers.get("Cart-Token") || response.headers.get("cart-token");
}

export async function getCart(cartToken?: string): Promise<{
  cart: WooCart | null;
  cartToken: string | null;
  error?: string;
}> {
  try {
    const res = await getCartFromServer(cartToken);
    const token = extractCartToken(res);
    if (!res.ok) {
      return { cart: null, cartToken: token, error: `Failed to get cart: ${res.status}` };
    }
    const cart = (await res.json()) as WooCart;
    return { cart, cartToken: token };
  } catch (e) {
    return { cart: null, cartToken: null, error: (e as Error).message };
  }
}

export async function addToCart(
  productId: number,
  quantity: number,
  cartToken?: string,
  variation?: { attribute: string; value: string }[]
): Promise<{ cart: WooCart | null; cartToken: string | null; error?: string }> {
  const parsed = AddToCartSchema.safeParse({ productId, quantity, cartToken, variation });
  if (!parsed.success) {
    return { cart: null, cartToken: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    const { productId: pid, quantity: qty, variation: vars, cartToken: token } = parsed.data;
    const res = await addToCartOnServer(pid, qty, vars, token);
    const resToken = extractCartToken(res);
    if (!res.ok) {
      const body = await res.text();
      return { cart: null, cartToken: resToken, error: body };
    }
    const cart = (await res.json()) as WooCart;
    return { cart, cartToken: resToken };
  } catch (e) {
    return { cart: null, cartToken: null, error: (e as Error).message };
  }
}

export async function updateCartItem(
  key: string,
  quantity: number,
  cartToken?: string
): Promise<{ cart: WooCart | null; cartToken: string | null; error?: string }> {
  const parsed = UpdateCartItemSchema.safeParse({ key, quantity, cartToken });
  if (!parsed.success) {
    return { cart: null, cartToken: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    const res = await updateCartItemOnServer(parsed.data.key, parsed.data.quantity, parsed.data.cartToken);
    const token = extractCartToken(res);
    if (!res.ok) {
      const body = await res.text();
      return { cart: null, cartToken: token, error: body };
    }
    const cart = (await res.json()) as WooCart;
    return { cart, cartToken: token };
  } catch (e) {
    return { cart: null, cartToken: null, error: (e as Error).message };
  }
}

export async function removeFromCart(
  key: string,
  cartToken?: string
): Promise<{ cart: WooCart | null; cartToken: string | null; error?: string }> {
  const parsed = RemoveCartItemSchema.safeParse({ key, cartToken });
  if (!parsed.success) {
    return { cart: null, cartToken: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    const res = await removeCartItemOnServer(parsed.data.key, parsed.data.cartToken);
    const token = extractCartToken(res);
    if (!res.ok) {
      const body = await res.text();
      return { cart: null, cartToken: token, error: body };
    }
    const cart = (await res.json()) as WooCart;
    return { cart, cartToken: token };
  } catch (e) {
    return { cart: null, cartToken: null, error: (e as Error).message };
  }
}

export async function checkout(
  billingAddress: BillingAddress,
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  cartToken?: string,
  paymentData?: { key: string; value: string }[]
): Promise<{ order: WooCheckoutOrder | null; error?: string }> {
  try {
    const res = await checkoutOnServer(
      {
        billing_address: billingAddress as unknown as Record<string, string>,
        shipping_address: shippingAddress as unknown as Record<string, string>,
        payment_method: paymentMethod,
        payment_data: paymentData,
      },
      cartToken
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[checkout] WooCommerce checkout API error:", res.status, body);
      return { order: null, error: body };
    }
    const order = (await res.json()) as WooCheckoutOrder;
    return { order };
  } catch (e) {
    console.error("[checkout] Unexpected error:", (e as Error).message);
    return { order: null, error: (e as Error).message };
  }
}

export async function updateCustomer(
  billingAddress: Record<string, string>,
  shippingAddress: Record<string, string>,
  cartToken?: string
): Promise<{ cart: WooCart | null; cartToken: string | null; error?: string }> {
  const billingParsed = PartialAddressSchema.safeParse(billingAddress);
  const shippingParsed = PartialAddressSchema.safeParse(shippingAddress);
  if (!billingParsed.success || !shippingParsed.success) {
    return { cart: null, cartToken: null, error: "Invalid address data" };
  }
  try {
    const res = await updateCustomerOnServer(billingParsed.data, shippingParsed.data, cartToken);
    const token = extractCartToken(res);
    if (!res.ok) {
      const body = await res.text();
      return { cart: null, cartToken: token, error: body };
    }
    const cart = (await res.json()) as WooCart;
    return { cart, cartToken: token };
  } catch (e) {
    return { cart: null, cartToken: null, error: (e as Error).message };
  }
}

export async function selectShippingRate(
  packageId: number,
  rateId: string,
  cartToken?: string
): Promise<{ cart: WooCart | null; cartToken: string | null; error?: string }> {
  const parsed = SelectShippingRateSchema.safeParse({ packageId, rateId, cartToken });
  if (!parsed.success) {
    return { cart: null, cartToken: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    const res = await selectShippingRateOnServer(parsed.data.packageId, parsed.data.rateId, parsed.data.cartToken);
    const token = extractCartToken(res);
    if (!res.ok) {
      const body = await res.text();
      return { cart: null, cartToken: token, error: body };
    }
    const cart = (await res.json()) as WooCart;
    return { cart, cartToken: token };
  } catch (e) {
    return { cart: null, cartToken: null, error: (e as Error).message };
  }
}
