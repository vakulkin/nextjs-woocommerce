import type { WooProduct, WooStoreOrder } from "./types";

const WP_URL = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_PROTCOL}://${process.env.NEXT_PUBLIC_WOOCOMMERCE_HOST}`;
const STORE_API_URL = `${WP_URL}/wp-json/wc/store/v1`;

/** Build headers for cart-mutating requests. */
function cartHeaders(cartToken?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cartToken) headers["Cart-Token"] = cartToken;
  return headers;
}

async function cartFetch(
  url: string,
  body: unknown,
  cartToken?: string
): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: cartHeaders(cartToken),
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

async function storeApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${STORE_API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `WooCommerce API error ${res.status}: ${errorBody}`
    );
  }

  return res.json();
}

// ─── Products ───────────────────────────────────────────────

export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  search?: string;
  category?: string;
  orderby?: string;
  order?: string;
  on_sale?: boolean;
  featured?: boolean;
  include?: number[];
}): Promise<WooProduct[]> {
  const searchParams: Record<string, string> = {};
  if (params?.per_page) searchParams.per_page = String(params.per_page);
  if (params?.page) searchParams.page = String(params.page);
  if (params?.search) searchParams.search = params.search;
  if (params?.category) searchParams.category = params.category;
  if (params?.orderby) searchParams.orderby = params.orderby;
  if (params?.order) searchParams.order = params.order;
  if (params?.on_sale) searchParams.on_sale = "true";
  if (params?.featured) searchParams.featured = "true";
  if (params?.include?.length) searchParams.include = params.include.join(",");

  return storeApiFetch<WooProduct[]>("/products", { next: { revalidate: 3600 } }, searchParams);
}

/** Same as getProducts but also returns X-WP-TotalPages from response headers. */
export async function getProductsMeta(params?: Parameters<typeof getProducts>[0]): Promise<{
  products: WooProduct[];
  totalPages: number;
}> {
  const searchParams: Record<string, string> = {};
  if (params?.per_page) searchParams.per_page = String(params.per_page);
  if (params?.page) searchParams.page = String(params.page);
  if (params?.search) searchParams.search = params.search;
  if (params?.category) searchParams.category = params.category;
  if (params?.orderby) searchParams.orderby = params.orderby;
  if (params?.order) searchParams.order = params.order;
  if (params?.on_sale) searchParams.on_sale = "true";
  if (params?.featured) searchParams.featured = "true";

  const url = new URL(`${STORE_API_URL}/products`);
  Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return { products: [], totalPages: 1 };

  const products = (await res.json()) as WooProduct[];
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
  return { products, totalPages: isNaN(totalPages) ? 1 : totalPages };
}

export async function getProduct(idOrSlug: string): Promise<WooProduct> {
  // Store API uses product ID; try to find by slug first
  const products = await storeApiFetch<WooProduct[]>(
    "/products",
    { next: { revalidate: 3600 } },
    { slug: idOrSlug }
  );
  if (products.length > 0) return products[0];
  // Fallback: try as numeric ID
  return storeApiFetch<WooProduct>(`/products/${idOrSlug}`, {
    next: { revalidate: 3600 },
  });
}

/**
 * Fetch prices for a specific variation by its product ID.
 * The Store API returns a full product-shaped object for variations.
 */
export async function getVariationData(variationId: number): Promise<{
  prices: WooProduct["prices"] | null;
  is_in_stock: boolean;
} | null> {
  try {
    const data = await storeApiFetch<WooProduct>(`/products/${variationId}`, {
      cache: "no-store",
    });
    return { prices: data.prices ?? null, is_in_stock: data.is_in_stock ?? true };
  } catch {
    return null;
  }
}

export async function searchProducts(query: string): Promise<WooProduct[]> {
  return getProducts({ search: query, per_page: 20 });
}

// ─── Cart ────────────────────────────────────────────────────

export async function getCartFromServer(cartToken?: string): Promise<Response> {
  return fetch(`${STORE_API_URL}/cart`, { headers: cartHeaders(cartToken), cache: "no-store" });
}

export async function addToCartOnServer(
  productId: number,
  quantity: number,
  variation?: { attribute: string; value: string }[],
  cartToken?: string
) {
  const body: Record<string, unknown> = { id: productId, quantity };
  if (variation) body.variation = variation;
  return cartFetch(`${STORE_API_URL}/cart/add-item`, body, cartToken);
}

export async function updateCartItemOnServer(key: string, quantity: number, cartToken?: string) {
  return cartFetch(`${STORE_API_URL}/cart/update-item`, { key, quantity }, cartToken);
}

export async function removeCartItemOnServer(key: string, cartToken?: string) {
  return cartFetch(`${STORE_API_URL}/cart/remove-item`, { key }, cartToken);
}

export async function updateCustomerOnServer(
  billingAddress: Record<string, string>,
  shippingAddress: Record<string, string>,
  cartToken?: string
) {
  return cartFetch(
    `${STORE_API_URL}/cart/update-customer`,
    { billing_address: billingAddress, shipping_address: shippingAddress },
    cartToken
  );
}

export async function selectShippingRateOnServer(packageId: number, rateId: string, cartToken?: string) {
  return cartFetch(
    `${STORE_API_URL}/cart/select-shipping-rate`,
    { package_id: packageId, rate_id: rateId },
    cartToken
  );
}

export async function getStoreOrder(
  orderId: string | number,
  orderKey: string,
  billingEmail?: string
): Promise<WooStoreOrder | null> {
  const params = new URLSearchParams({ key: orderKey });
  if (billingEmail) params.set("billing_email", billingEmail);
  const res = await fetch(`${STORE_API_URL}/order/${orderId}?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<WooStoreOrder>;
}

export async function checkoutOnServer(
  data: {
    billing_address: Record<string, string>;
    shipping_address: Record<string, string>;
    payment_method: string;
    payment_data?: { key: string; value: string }[];
  },
  cartToken?: string
) {
  console.log("[checkoutOnServer] Request body:", JSON.stringify(data, null, 2));
  const res = await cartFetch(`${STORE_API_URL}/checkout`, data, cartToken);
  if (!res.ok) {
    const body = await res.clone().text();
    console.error("[checkoutOnServer] WooCommerce response", res.status, body);
  }
  return res;
}
