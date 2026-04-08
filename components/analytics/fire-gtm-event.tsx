"use client";

import { useEffect, useRef } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

interface FireGTMEventProps {
  /** GTM/GA4 event name, e.g. "view_item_list" */
  event: string;
  /** Event parameters */
  params: Record<string, unknown>;
  /**
   * Set to true for ecommerce events (view_item, view_item_list,
   * add_to_cart, purchase, etc.). Wraps params in `ecommerce: {}` and pushes
   * a `{ ecommerce: null }` clear first to prevent data bleed between events.
   * Leave false (default) for non-ecommerce events like search, login, etc.
   */
  ecommerce?: boolean;
}

/**
 * Fires a GTM dataLayer event on first mount.
 * Use in server components that need to push a dataLayer event on page load.
 *
 * @example — ecommerce event
 * <FireGTMEvent event="purchase" params={purchaseParams} ecommerce />
 *
 * @example — non-ecommerce event
 * <FireGTMEvent event="search" params={{ search_term: query }} />
 */
export function FireGTMEvent({ event, params, ecommerce = false }: FireGTMEventProps) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (ecommerce) {
      sendGTMEvent({ ecommerce: null });
      sendGTMEvent({ event, ecommerce: params });
    } else {
      sendGTMEvent({ event, ...params });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fire once — params are stable SSR values
  return null;
}
