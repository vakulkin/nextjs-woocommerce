import { z } from "zod";

// ── Address schemas (shared by checkout form and cart actions) ────────────────

export const BillingSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  company: z.string().default(""),
  address_1: z.string().min(1, "Address is required"),
  address_2: z.string().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().default(""),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(2, "Country is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().default(""),
});

export const ShippingSchema = z.object({
  first_name: z.string().default(""),
  last_name: z.string().default(""),
  company: z.string().default(""),
  address_1: z.string().default(""),
  address_2: z.string().default(""),
  city: z.string().default(""),
  state: z.string().default(""),
  postcode: z.string().default(""),
  country: z.string().default(""),
});

/**
 * Loose address schema used for shipping estimate updates — all fields optional
 * strings, no field can exceed 255 characters to prevent oversized payloads.
 */
export const PartialAddressSchema = z.record(
  z.string(),
  z.string().max(255)
);

// ── Cart operation schemas ────────────────────────────────────────────────────

export const AddToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999),
  cartToken: z.string().max(512).optional(),
  variation: z
    .array(z.object({ attribute: z.string().max(200), value: z.string().max(200) }))
    .optional(),
});

export const UpdateCartItemSchema = z.object({
  key: z.string().min(1).max(200),
  quantity: z.number().int().min(0).max(999),
  cartToken: z.string().max(512).optional(),
});

export const RemoveCartItemSchema = z.object({
  key: z.string().min(1).max(200),
  cartToken: z.string().max(512).optional(),
});

export const SelectShippingRateSchema = z.object({
  packageId: z.number().int().min(0),
  rateId: z.string().min(1).max(200),
  cartToken: z.string().max(512).optional(),
});

/** Combined client-side checkout form schema — used by React Hook Form. */
export const CheckoutFormSchema = z.object({
  billing: BillingSchema,
  shipping: ShippingSchema,
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;

// ── Shop page URL params ──────────────────────────────────────────────────────

/**
 * Validates and sanitises shop page query params.
 * Invalid/unknown values fall back to `undefined` via `.catch(undefined)` so
 * components can apply their own defaults without crashing.
 */
export const ShopParamsSchema = z.object({
  page: z.string().regex(/^\d+$/).optional().catch(undefined),
  orderby: z
    .enum(["date", "price", "price-desc", "rating", "popularity", "alphabetical"])
    .optional()
    .catch(undefined),
  order: z.enum(["asc", "desc"]).optional().catch(undefined),
  on_sale: z.enum(["true", "false"]).optional().catch(undefined),
  // Category slugs: lowercase letters, digits, hyphens only
  category: z
    .string()
    .regex(/^[a-z0-9-]{1,100}$/)
    .optional()
    .catch(undefined),
});

// ── Search query ──────────────────────────────────────────────────────────────

/** Strips whitespace and prevents absurdly long queries from hitting the API. */
export const SearchQuerySchema = z.string().trim().min(1).max(200);

// ── Order confirmation URL params ─────────────────────────────────────────────

export const OrderConfirmationParamsSchema = z.object({
  /** WooCommerce numeric order ID */
  order_id: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .catch(undefined),
  /** Stripe checkout session ID — format: cs_test_... or cs_live_... */
  session_id: z
    .string()
    .regex(/^cs_(test|live)_[A-Za-z0-9_]+$/)
    .optional()
    .catch(undefined),
  /** WooCommerce order key — format: wc_order_<alphanumeric> */
  order_key: z
    .string()
    .regex(/^wc_order_[A-Za-z0-9]+$/)
    .optional()
    .catch(undefined),
  billing_email: z.email().optional().catch(undefined),
});
