"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
  /** "sm" renders h-6 w-6 buttons (cart sheet), "default" renders h-8 w-8 (cart page / add-to-cart). */
  size?: "sm" | "default";
}

export function QuantityInput({
  value,
  min,
  max,
  onDecrement,
  onIncrement,
  disabled,
  size = "default",
}: QuantityInputProps) {
  const btnCls = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const iconCls = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const valCls = size === "sm" ? "w-6 text-xs" : "w-8 text-sm";
  const gapCls = size === "sm" ? "gap-1.5" : "gap-2";

  return (
    <div className={`flex items-center ${gapCls}`}>
      <Button
        variant="outline"
        size="icon"
        className={btnCls}
        onClick={onDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className={iconCls} />
      </Button>
      <span
        className={`${valCls} text-center font-medium`}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        className={btnCls}
        onClick={onIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className={iconCls} />
      </Button>
    </div>
  );
}
