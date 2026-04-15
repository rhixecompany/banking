import type { Page } from "@playwright/test";

/**
 * Injects a small stub of the Plaid Link SDK into the page before scripts run.
 * The stub exposes Plaid.create and immediately calls onSuccess with a
 * deterministic public token so tests can short-circuit the client flow.
 */
export async function addMockPlaidInitScript(
  page: Page,
  publicToken = "MOCK_PUBLIC_TOKEN",
): Promise<void> {
  // Use a string script so we can interpolate the publicToken safely.
  const script = `(() => {
    // Minimal Plaid Link shim used in tests
    window.Plaid = {
      create: function(opts) {
        // Simulate async behavior of Plaid Link and invoke onSuccess
        setTimeout(() => {
          try {
            if (opts && typeof opts.onSuccess === 'function') {
              opts.onSuccess(${JSON.stringify(publicToken)}, { metadata: {} });
            }
          } catch (e) {
            // swallow errors in the test shim
          }
        }, 0);
        return { open: function() {} };
      }
    };
  })();`;

  await page.addInitScript(script);
}
