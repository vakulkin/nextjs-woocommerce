/**
 * Default English UI strings — the single source of truth for all text.
 * To customise any text, copy the key you want into lib/i18n/custom.ts and
 * override it there.  You never need to edit this file directly.
 */
export const en = {
  brand: {
    name: "Next.js WooCommerce",
    tagline: "Fine Fragrances",
    description:
      "Premium fragrances crafted for the discerning connoisseur. Each bottle tells a story.",
    copyright: "All rights reserved.",
    fineLine: "Fine fragrances for every occasion.",
  },

  nav: {
    mainLabel: "Main navigation",
    shopAll: "Shop All",
    onSale: "On Sale",
  },

  header: {
    openCart: "Open cart",
  },

  footer: {
    shopHeading: "Shop",
    accountHeading: "Account",
    contactHeading: "Contact",
    contactBody: "Questions? Our team is here to help you find your perfect scent.",
    links: {
      allProducts: "All Products",
      sale: "Sale",
      bestSellers: "Best Sellers",
      cart: "Your Cart",
      checkout: "Checkout",
    },
  },

  search: {
    placeholder: "Search products...",
    ariaLabel: "Search products",
    clearLabel: "Clear search",
    seeAllResults: "See all results for",
    pageTitle: "Search",
    noResults: "No products found for",
    tryDifferent: "Try a different search term.",
    enterTerm: "Enter a search term to find products.",
  },

  cart: {
    pageTitle: "Shopping Cart",
    sheetTitle: "Your Cart",
    emptyTitle: "Your Cart is Empty",
    emptyHint: "Looks like you haven\u2019t added anything to your cart yet.",
    emptySheetHint: "Discover our collection of fine fragrances.",
    shopAll: "Shop All Fragrances",
    continueShopping: "Continue Shopping",
    proceedToCheckout: "Proceed to Checkout",
    viewFullCart: "View Full Cart",
    removeItem: "Remove item",
    noImage: "—",
    noImageFull: "No image",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    discount: "Discount",
    tax: "Tax",
    total: "Total",
    free: "Free",
  },

  wishlist: {
    pageTitle: "My Wishlist",
    savedItems: "Saved Items",
    itemSingular: "item",
    itemPlural: "items",
    emptyTitle: "Your wishlist is empty",
    emptyHint: "Save your favourite fragrances here so you can find them easily later.",
    browseCollection: "Browse the Collection",
    clearAll: "Clear all",
    wishlistCleared: "Wishlist cleared",
    savedToast: "Saved to wishlist",
    removedToast: "Removed from wishlist",
    addAriaLabel: "Add to wishlist",
    removeAriaLabel: "Remove from wishlist",
    removedFromWishlist: "removed from wishlist",
    noImage: "No image",
    saleBadge: "Sale",
    soldOutBadge: "Sold Out",
  },

  product: {
    noImage: "—",
    noImageAlt: "No image",
    saleBadge: "Sale",
    soldOutBadge: "Sold Out",
    viewProduct: "View product",
    addToCart: "Add to Cart",
    added: "Added to Cart",
    adding: "Adding...",
    outOfStock: "Out of Stock",
    buyProduct: "Buy Product",
    groupedHint: "This is a grouped product. View individual items in the shop.",
    browseProducts: "Browse Products",
    quantity: "Quantity",
    inStock: "In Stock",
    lowStockLeft: "left \u2013 order soon",
    lowStockOnly: "Only",
    selectAllOptions: "Please select all options",
    cantAddToCart: "Couldn\u2019t add to cart. Please try again.",
    savePct: "Save",
    priceFrom: "From",
    freeShipping: "Free shipping",
    freeShippingSub: "On orders over $50",
    returns: "30-day returns",
    returnsSub: "Hassle-free policy",
    secureCheckout: "Secure checkout",
    secureCheckoutSub: "256-bit SSL encrypted",
    authenticity: "Authenticity",
    authenticitySub: "Genuine products only",
    sku: "SKU:",
  },

  productSpecs: {
    title: "Specifications",
    ariaLabel: "Product specifications",
  },

  productBreadcrumb: {
    shop: "Shop",
  },

  relatedProducts: {
    eyebrow: "Explore More",
    title: "You may also like",
  },

  shop: {
    pageTitle: "Shop",
    collection: "Collection",
    allFragrances: "All Fragrances",
    onSale: "On Sale",
    sortBy: "Sort by",
    showSaleOnly: "Show Sale Only",
    clearOnSale: "Clear: On Sale",
    noProducts:
      "No products found. Please check your WooCommerce store configuration.",
    paginationLabel: "Pagination",
    paginationFirst: "First page",
    paginationPrev: "Previous page",
    paginationNext: "Next page",
    paginationLast: "Last page",
    sort: {
      newest: "Newest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      popularity: "Popularity",
    },
  },

  home: {
    hero: {
      eyebrow: "The Art of Fragrance",
      heading1: "WooCoommerce",
      heading2: "headless Next.js",
      heading3: "storefront",
      description:
        "Premium fragrances crafted for the discerning connoisseur.\n            Explore our curated collection of timeless scents.",
      shopNow: "Shop Now",
      viewSale: "View Sale",
    },
    trust: {
      natural: { title: "Natural Ingredients", desc: "Sourced from the world\u2019s finest botanical gardens." },
      crafted: { title: "Master Crafted", desc: "Each fragrance composed by award-winning perfumers." },
      quality: { title: "Quality Guaranteed", desc: "Every bottle tested and certified for purity." },
      shipping: { title: "Free Shipping", desc: "Complimentary delivery on all orders over $75." },
    },
    featured: {
      noProducts:
        "No products found. Please check your WooCommerce store configuration.",
    },
    onSale: {
      eyebrow: "Limited Time",
      heading: "On Sale",
      viewAll: "View All",
    },
    brandStory: {
      eyebrow: "Our Philosophy",
      heading: "Scent Is the Memory of the Soul",
      description:
        "Every fragrance in our collection is a journey \u2014 blending rare botanicals,\n            precious resins, and timeless accords into something unforgettable.",
      cta: "Explore the Collection",
    },
  },

  checkout: {
    pageTitle: "Checkout",
    loadingCart: "Loading your cart...",
    emptyTitle: "Your Cart is Empty",
    emptyHint: "Add some items to your cart before checking out.",
    continueShopping: "Continue Shopping",
    billingTitle: "Billing Details",
    shippingTitle: "Shipping Address",
    sameAsBilling: "Same as billing address",
    paymentTitle: "Payment Method",
    shippingMethodTitle: "Shipping Method",
    orderSummaryTitle: "Order Summary",
    secureCheckout: "Secure Checkout",
    placeOrder: "Place Order",
    payWithStripe: "Pay with Stripe",
    processing: "Processing...",
    recalculating: "Recalculating...",
    freeShipping: "Free",
    failedShipping: "Failed to update shipping method.",
    payment: {
      bacs: "Direct Bank Transfer",
      cheque: "Check Payment",
      cod: "Cash on Delivery",
      stripe: "Credit / Debit Card",
      stripe_cc: "Credit / Debit Card",
      paypal: "PayPal",
    },
    paymentDesc: {
      bacs: "Make your payment directly into our bank account. Please use your order number as the payment reference. Your order will not be shipped until the funds have cleared in our account.",
      cheque: "Please send a check to our store postal address. Your order will not be shipped until the funds have cleared.",
      cod: "Pay with cash upon delivery.",
      stripe: "Pay securely with your credit or debit card via Stripe.",
      stripe_cc: "Pay securely with your credit or debit card via Stripe.",
      paypal: "Pay via PayPal; you will be redirected to the PayPal site.",
    },
    stripeRedirect: "You will be redirected to Stripe\u2019s secure checkout.",
    fields: {
      firstName: "First Name *",
      lastName: "Last Name *",
      company: "Company",
      email: "Email *",
      phone: "Phone",
      address1: "Address *",
      address2: "Address Line 2",
      city: "City *",
      state: "State / Province",
      postcode: "Postcode *",
      country: "Country *",
      // Placeholders
      firstNamePlaceholder: "e.g. John",
      lastNamePlaceholder: "e.g. Doe",
      companyPlaceholder: "Optional",
      emailPlaceholder: "email@example.com",
      phonePlaceholder: "+1 234 567 8900",
      streetPlaceholder: "Street address",
      aptPlaceholder: "Apartment, suite, etc.",
      cityPlaceholder: "e.g. Warsaw",
      statePlaceholder: "e.g. NY",
      postcodePlaceholder: "e.g. 91-311",
      countryPlaceholder: "e.g. PL, US, GB",
    },
  },

  orderConfirmation: {
    confirmedTitle: "Order Confirmed!",
    pendingTitle: "Payment Pending",
    failureTitle: "Payment Not Completed",
    orderNumber: "Your order number is",
    successBody:
      "Thank you for your purchase. You will receive an order confirmation email shortly.",
    pendingBody:
      "Your payment is being processed. We will send you an email confirmation once the funds have cleared \u2014 this can take 1\u20133 business days depending on your payment method.",
    failureVerifyBody:
      "There was an issue verifying your payment. If you were charged, please contact support.",
    failureBody:
      "Your payment was not completed. Please try again or contact support.",
    continueShopping: "Continue Shopping",
    returnToCheckout: "Return to Checkout",
    orderSummaryTitle: "Order Summary",
    billedTo: "Billed to",
    qty: "Qty:",
    subtotal: "Subtotal",
    discount: "Discount",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
  },

  notFound: {
    code: "404",
    title: "Page Not Found",
    description: "The page you\u2019re looking for doesn\u2019t exist or has been moved.",
    goHome: "Go Home",
    browseShop: "Browse Shop",
  },
};

export type Translations = typeof en;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};
export type CustomTranslations = DeepPartial<Translations>;
