#!/usr/bin/env ts-node
import { main as mcpMain } from "../../mcp-runner";
import { parseCli, printDryRunResult } from "../utils/cli";

async function run() {
  const cli = parseCli();
  // mcp-runner is usually interactive or list-only; support dry-run
  if (cli.dryRun) {
    const summary = "mcp-runner dry-run: will list or invoke MCP tool";
    printDryRunResult(summary, { ok: true });
    return;
  }
  await mcpMain(process.argv.slice(2));
}

if (require.main === module)
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
