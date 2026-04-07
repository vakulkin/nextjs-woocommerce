import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn(undefined, null, "text-sm")).toBe("text-sm");
  });

  it("returns empty string when no arguments", () => {
    expect(cn()).toBe("");
  });
});
