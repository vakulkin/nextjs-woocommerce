/**
 * Format a WooCommerce price string (in minor units) to display format
 */
export function formatPrice(
  price: string,
  currencyMinorUnit: number = 2,
  currencyPrefix: string = "$",
  currencySuffix: string = ""
): string {
  const numericPrice = parseInt(price, 10) / Math.pow(10, currencyMinorUnit);
  const formatted = numericPrice.toFixed(currencyMinorUnit);
  return `${currencyPrefix}${formatted}${currencySuffix}`;
}

/**
 * Format price from a WooCommerce prices object
 */
export function formatProductPrice(prices: {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}): { current: string; regular: string; onSale: boolean } {
  const current = formatPrice(
    prices.price,
    prices.currency_minor_unit,
    prices.currency_prefix,
    prices.currency_suffix
  );
  const regular = formatPrice(
    prices.regular_price,
    prices.currency_minor_unit,
    prices.currency_prefix,
    prices.currency_suffix
  );
  const onSale = prices.sale_price !== "" && prices.sale_price !== prices.regular_price;
  return { current, regular, onSale };
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
