import { render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach } from "vitest";
import TodoPage from "../../src/routes/todo";
import { Router, Route } from "@solidjs/router";

// Mock fetch to avoid real network requests
globalThis.fetch = vi.fn();

describe("TodoPage components", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders the primary elements and fetches initial data", async () => {
    render(() => (
      <Router>
        <Route path="/" component={TodoPage} />
      </Router>
    ));

    expect(screen.getByText("Todo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();

    // Check if fetch was called to load items
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/todo");
    });
  });
});
