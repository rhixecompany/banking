#!/usr/bin/env tsx
import { execa } from "execa";

// Minimal git commit helper that stages given files and creates a conventional commit message.
// Usage: npx tsx scripts/utils/ci-helpers/git-commit-helper.ts "fix: lint" file1 file2 --apply

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} cmd
 * @param {string[]} args
 * @returns {*}
 */
async function run(cmd: string, args: string[]) {
  const p = execa(cmd, args, { shell: true, stdio: "inherit" });
  await p;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const args = argv.filter((a) => a !== "--apply");
  if (args.length < 2) {
    console.log(
      'Usage: git-commit-helper.ts "<type: summary>" <file> [file...] [--apply]',
    );
    process.exit(1);
  }
  const message = args[0];
  const files = args.slice(1);
  console.log("Staging files:", files);
  console.log("Commit message:", message);
  if (!apply) {
    console.log(
      'Dry-run: would run: git add <files> && git commit -m "message"',
    );
    return;
  }
  await run("git", ["add", ...files]);
  await run("git", ["commit", "-m", message]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
