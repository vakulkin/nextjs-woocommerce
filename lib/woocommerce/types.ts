// WooCommerce Store API Types

export interface WooImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  image: WooImage | null;
}

export interface WooProductAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: {
    id: number;
    name: string;
    slug: string;
    default: boolean;
  }[];
}

export interface WooProductVariation {
  id: number;
  attributes: {
    name: string;
    value: string;
  }[];
  /** Present only when fetched via ?type=variation; absent in base product response. */
  prices?: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  is_in_stock?: boolean;
  image?: WooImage | null;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | "grouped" | "external";
  description: string;
  short_description: string;
  sku: string;
  permalink: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
    price_range: {
      min_amount: string;
      max_amount: string;
    } | null;
  };
  images: WooImage[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  attributes: WooProductAttribute[];
  variations: WooProductVariation[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  on_sale: boolean;
  average_rating: string;
  review_count: number;
  low_stock_remaining: number | null;
  add_to_cart: {
    text: string;
    description: string;
    url: string;
    minimum: number;
    maximum: number;
    multiple_of: number;
  };
  external_url?: string;
  button_text?: string;
}

export interface WooCartItem {
  key: string;
  id: number;
  quantity: number;
  quantity_limits: {
    minimum: number;
    maximum: number;
    multiple_of: number;
    editable: boolean;
  };
  name: string;
  short_description: string;
  description: string;
  sku: string;
  images: WooImage[];
  variation: {
    attribute: string;
    value: string;
  }[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  totals: {
    line_subtotal: string;
    line_subtotal_tax: string;
    line_total: string;
    line_total_tax: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
}

export interface WooShippingRate {
  rate_id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  meta_data: { key: string; value: string }[];
  selected: boolean;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WooShippingPackage {
  package_id: number;
  name: string;
  destination: {
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: {
    key: string;
    name: string;
    quantity: number;
  }[];
  shipping_rates: WooShippingRate[];
}

export interface WooCart {
  items: WooCartItem[];
  coupons: {
    code: string;
    discount_type: string;
    totals: {
      total_discount: string;
      total_discount_tax: string;
      currency_code: string;
    };
  }[];
  totals: {
    total_items: string;
    total_items_tax: string;
    total_shipping: string;
    total_shipping_tax: string;
    total_discount: string;
    total_discount_tax: string;
    total_tax: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  items_count: number;
  items_weight: number;
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping_rates: WooShippingPackage[];
  payment_methods: string[];
}

export interface WooStoreOrderItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  images: WooImage[];
  variation: { attribute: string; value: string }[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  totals: {
    line_subtotal: string;
    line_subtotal_tax: string;
    line_total: string;
    line_total_tax: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
}

export interface WooStoreOrder {
  id: number;
  status: string;
  billing_address: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  items: WooStoreOrderItem[];
  totals: {
    subtotal: string;
    total_discount: string;
    total_shipping: string;
    total_fees: string;
    total_tax: string;
    total_price: string;
    total_items: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  coupons: {
    code: string;
    totals: {
      total_discount: string;
      currency_code: string;
      currency_symbol: string;
      currency_minor_unit: number;
    };
  }[];
  needs_payment: boolean;
  needs_shipping: boolean;
}

export interface WooCheckoutOrder {
  order_id: number;
  status: string;
  order_key: string;
  customer_note: string;
  payment_result: {
    payment_status: string;
    payment_details: {
      key: string;
      value: string;
    }[];
    redirect_url: string;
  };
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}
