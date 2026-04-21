#!/usr/bin/env ts-node
import { main as mcpMain } from "../../mcp-runner";
import { parseCli, printDryRunResult } from "../utils/cli";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function run() {
  const cli = parseCli();
  // mcp-runner is usually interactive or list-only; support dry-run
  if (cli.dryRun) {
    const summary = "mcp-runner dry-run: will list or invoke MCP tool";
    printDryRunResult(summary, { ok: true });
    return;
  }
  // mcp-runner's main() reads process.argv itself (via yargs/hideBin),
  // so don't pass arguments here — call with no parameters.
  await mcpMain();
}

if (require.main === module)
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
