import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CvViewer from "../pages/CvViewer";
import Hero from "../components/Hero";

describe("CvViewer & Hero CTA", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the View CV CTA in Hero", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/stats")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url.includes("/api/cv/status")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ exists: true, filename: "cv.pdf" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(
      <MemoryRouter>
        <Hero settings={null} taglines={[]} links={[]} />
      </MemoryRouter>
    );

    const viewCvLink = await screen.findByRole("link", { name: /view cv/i });
    expect(viewCvLink).toBeInTheDocument();
    expect(viewCvLink).toHaveAttribute("href", "/cv");
  });

  it("renders unavailable state when no CV exists", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/cv/status")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ exists: false }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(
      <MemoryRouter>
        <CvViewer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/cv currently unavailable/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /return to home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to portfolio/i })).toBeInTheDocument();
  });

  it("renders error state when CV fetch fails", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/cv/status")) {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(
      <MemoryRouter>
        <CvViewer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load cv/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
