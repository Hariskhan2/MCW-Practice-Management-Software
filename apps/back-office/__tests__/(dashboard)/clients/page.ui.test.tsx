import { describe, it, expect, vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    has: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => "/clients",
}));

/**
 * Unit tests for clients page
 * Tests imports and basic component loading
 */
describe("Clients Page", () => {
  it("should import the page component without errors", async () => {
    const ClientsPage = await import("@/(dashboard)/clients/page");

    expect(ClientsPage).toBeDefined();
    expect(ClientsPage.default).toBeDefined();
  }, 60000);
});
