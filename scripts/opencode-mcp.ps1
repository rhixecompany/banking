param([String[]]$Args)
npx tsx scripts/mcp-runner.ts --list --catalog-path .opencode/mcp_servers.json @Args
