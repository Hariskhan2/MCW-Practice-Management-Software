import { describe, it, expect } from "vitest";

/**
 * UI tests for email settings page
 * Tests imports and basic component loading
 * Marked as UI test because the component accesses DOM during import
 */
describe("Email Settings Page", () => {
  it("should import the page component without errors", async () => {
    const EmailSettingsPage = await import("@/(dashboard)/settings/email/page");

    expect(EmailSettingsPage).toBeDefined();
    expect(EmailSettingsPage.default).toBeDefined();
  }, 60000);
});
