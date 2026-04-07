import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/lib/hooks/use-debounce";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe("hello");
  });

  it("updates the value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("world");
  });

  it("resets the timer when the value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => { jest.advanceTimersByTime(200); });

    // Second change before 300 ms — timer should reset
    rerender({ value: "c" });
    act(() => { jest.advanceTimersByTime(200); }); // 200 ms into new timer (400 ms total)

    // Not enough time for the new timer to fire
    expect(result.current).toBe("a");

    act(() => { jest.advanceTimersByTime(100); }); // 300 ms into «c» timer
    expect(result.current).toBe("c");
  });

  it("works with numeric values", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 500),
      { initialProps: { value: 0 } }
    );

    rerender({ value: 42 });
    act(() => { jest.advanceTimersByTime(500); });

    expect(result.current).toBe(42);
  });
});
