/**
 * SearchBar component tests.
 *
 * The search server action and next/navigation router are mocked.
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/search-bar";
import { makeProduct } from "../fixtures";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { fill, ...rest } = props; // biome-ignore lint: test mock
    void fill;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={rest.alt ?? ""} {...rest} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: React.PropsWithChildren<{ href: string; [key: string]: unknown }>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockSearchAction = jest.fn();
jest.mock("@/lib/actions/search", () => ({
  searchAction: (...args: unknown[]) => mockSearchAction(...args),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function setup() {
  const user = userEvent.setup({ delay: null });
  const utils = render(<SearchBar />);
  const input = screen.getByRole("searchbox", { name: /search products/i });
  return { user, input, ...utils };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("SearchBar — rendering", () => {
  it("renders the search input", () => {
    render(<SearchBar />);
    expect(screen.getByRole("searchbox", { name: /search products/i })).toBeInTheDocument();
  });

  it("does not show a clear button when the input is empty", () => {
    render(<SearchBar />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });
});

describe("SearchBar — typing & debounce", () => {
  it("shows the clear button after typing", async () => {
    const { user, input } = setup();
    await user.type(input, "rose");
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("does NOT call searchAction for queries shorter than 2 chars", async () => {
    const { user, input } = setup();
    await user.type(input, "r");
    jest.runAllTimers();
    expect(mockSearchAction).not.toHaveBeenCalled();
  });

  it("calls searchAction after debounce delay", async () => {
    mockSearchAction.mockResolvedValue([]);
    const { user, input } = setup();
    await user.type(input, "rose");
    jest.runAllTimers();
    await waitFor(() => expect(mockSearchAction).toHaveBeenCalledWith("rose"));
  });

  it("displays results returned from searchAction", async () => {
    const products = [
      makeProduct({ id: 1, name: "Rose Oud", slug: "rose-oud" }),
      makeProduct({ id: 2, name: "Rose Noir", slug: "rose-noir" }),
    ];
    mockSearchAction.mockResolvedValue(products);

    const { user, input } = setup();
    await user.type(input, "rose");
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText("Rose Oud")).toBeInTheDocument();
      expect(screen.getByText("Rose Noir")).toBeInTheDocument();
    });
  });
});

describe("SearchBar — clear button", () => {
  it("clears the input when the clear button is clicked", async () => {
    const { user, input } = setup();
    await user.type(input, "musk");
    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(input).toHaveValue("");
  });
});

describe("SearchBar — form submission", () => {
  it("navigates to /search with encoded query on submit", async () => {
    mockSearchAction.mockResolvedValue([]);
    const { user, input } = setup();
    await user.type(input, "rose oud");
    await user.keyboard("{Enter}");
    expect(mockPush).toHaveBeenCalledWith("/search?q=rose%20oud");
  });

  it("does not navigate when the query is empty", async () => {
    const { user } = setup();
    await user.keyboard("{Enter}");
    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe("SearchBar — keyboard — Escape closes dropdown", () => {
  it("closes the dropdown on Escape", async () => {
    const products = [makeProduct({ id: 1, name: "Amber Wood" })];
    mockSearchAction.mockResolvedValue(products);

    const { user, input } = setup();
    await user.type(input, "amber");
    jest.runAllTimers();

    await waitFor(() =>
      expect(screen.getByText("Amber Wood")).toBeInTheDocument()
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Amber Wood")).not.toBeInTheDocument();
  });
});
