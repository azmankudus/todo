import { render, screen, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SqlPage from "../../src/routes/sql";
import { Router, Route } from "@solidjs/router";

describe("SqlPage tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        columns: ["id"],
        rows: [{ id: 1 }]
      }),
    });
  });

  it("should display SQL Explorer headers", () => {
    render(() => (
      <Router>
        <Route path="/" component={SqlPage} />
      </Router>
    ));
    expect(screen.getByText("SQL Database Explorer")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("SELECT * FROM todo")).toBeInTheDocument();
  });

  it("should trigger execution when button clicked", async () => {
    render(() => (
      <Router>
        <Route path="/" component={SqlPage} />
      </Router>
    ));

    const textArea = screen.getByPlaceholderText("SELECT * FROM todo");
    const button = screen.getByText("Execute Query");

    fireEvent.input(textArea, { target: { value: "SELECT 1" } });
    fireEvent.click(button);

    expect(globalThis.fetch).toHaveBeenCalledWith("/api/sql", expect.objectContaining({
      method: "POST"
    }));
  });
});
