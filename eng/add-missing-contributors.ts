/**
 * One-time contributor detection and addition script.
 * Discovers missing contributors, determines their contribution types from repo history,
 * and updates .all-contributorsrc via the all-contributors CLI.
 *
 * Usage: tsx ./eng/add-missing-contributors.ts
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  fetchContributorMergedPrs,
  getContributionTypes,
  getMissingContributors,
} from "./contributor-report";
import { setupGracefulShutdown } from "./utils/graceful-shutdown";

const DEFAULT_CMD_TIMEOUT = 30_000; // 30 seconds

setupGracefulShutdown("add-missing-contributors");

/**
 * Get all files touched by a contributor from their merged PRs.
 */
const getContributorFiles = (username: string): string[] => {
  try {
    console.log(`📁 Getting files for contributor: ${username}`);

    const prs = fetchContributorMergedPrs(username, { includeAllFiles: true });

    if (prs.length === 0) {
      console.log(`📭 No merged PRs found for ${username}`);
      return [];
    }

    const files = new Set<string>();
    for (const pr of prs) {
      for (const file of pr.files || []) {
        if (file) {
          files.add(file);
        }
      }
    }

    const fileList = Array.from(files);
    console.log(
      `📄 Found ${fileList.length} unique files for ${username}: ${fileList.slice(0, 3).join(", ")}${fileList.length > 3 ? "..." : ""}`,
    );
    return fileList;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error getting files for ${username}:`, message);
    return [];
  }
};

/**
 * Determine contribution types from a contributor's files.
 */
const analyzeContributor = (username: string): string => {
  try {
    console.log(`🔍 Analyzing contribution types for: ${username}`);
    const files = getContributorFiles(username);

    if (files.length === 0) {
      console.log(`💡 No files found for ${username}, using 'code' fallback`);
      return "code";
    }

    const contributionTypes = getContributionTypes(files);

    if (!contributionTypes || contributionTypes.trim() === "") {
      console.log(
        `💡 No matching types found for ${username}, using 'code' fallback`,
      );
      return "code";
    }

    console.log(`✅ Determined types for ${username}: ${contributionTypes}`);
    return contributionTypes;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error analyzing files for ${username}:`, message);
    return "code";
  }
};

/**
 * Add a username to the ignore list in .all-contributorsrc.
 */
const addToIgnoreList = (username: string): boolean => {
  try {
    const configPath = path.join(process.cwd(), ".all-contributorsrc");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Record<
      string,
      unknown
    >;

    const ignoreList =
      (config.ignoreList as string[] | undefined) ||
      (config.ignore as string[] | undefined) ||
      [];
    if (!ignoreList.includes(username)) {
      ignoreList.push(username);
      config.ignoreList = ignoreList;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.warn(
        `⚠️  Added ${username} to ignore list (user not found on GitHub)`,
      );
      return true;
    }
    return false;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to add ${username} to ignore list:`, message);
    return false;
  }
};

/**
 * Run the all-contributors CLI to add a contributor to the project.
 */
const addContributor = (username: string, types: string): boolean => {
  try {
    console.log(`➕ Adding contributor: ${username} with types: ${types}`);

    const command = `npx all-contributors add ${username} ${types}`;

    execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: DEFAULT_CMD_TIMEOUT,
    });

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // System-level errors that should propagate up
    if (message.includes("rate limit") || message.includes("403")) {
      console.error(`⏱️  Rate limit encountered while adding ${username}.`);
      throw error;
    }
    if (message.includes("network") || message.includes("timeout")) {
      console.error(`🌐 Network error while adding ${username}.`);
      throw error;
    }

    // User-specific errors that can be skipped
    if (message.includes("404") || message.includes("not found")) {
      addToIgnoreList(username);
      console.error(`❌ User ${username} not found, added to ignore list`);
      return false;
    }

    // Unknown error - log and skip
    console.error(`❌ Failed to add contributor ${username}:`, message);
    return false;
  }
};

/**
 * Process a single missing contributor: detect types and add via all-contributors CLI.
 */
const processContributor = async (
  username: string,
): Promise<{ added: number; failed: number }> => {
  let added = 0;
  let failed = 0;

  try {
    console.log(`📊 Step 2: Analyzing contribution types for ${username}...`);
    const contributionTypes = analyzeContributor(username);

    console.log(
      `➕ Step 3: Adding ${username} with types: ${contributionTypes}...`,
    );

    const success = addContributor(username, contributionTypes);
    if (success) {
      added++;
      console.log(`✅ Successfully processed ${username}`);
    } else {
      failed++;
      console.log(`❌ Failed to process ${username}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failed++;
    console.error(`💥 Error processing ${username}:`, message);
  }

  return { added, failed };
};

/**
 * Main entry point: detect and add missing contributors.
 */
const main = async (): Promise<{
  processed: number;
  added: number;
  failed: number;
}> => {
  console.log("🚀 Starting add missing contributors script");
  console.log("=".repeat(50));

  try {
    console.log("\n📋 Step 1: Detecting missing contributors...");
    const missingContributors = getMissingContributors();

    if (missingContributors.length === 0) {
      console.log(
        "🎉 No missing contributors found! All contributors are properly recognized.",
      );
      return { added: 0, failed: 0, processed: 0 };
    }

    console.log(
      `\n🔄 Processing ${missingContributors.length} missing contributors...`,
    );

    let processed = 0;
    let added = 0;
    let failed = 0;

    for (const username of missingContributors) {
      console.log(`\n${"─".repeat(30)}`);
      console.log(`👤 Processing contributor: ${username}`);

      processed++;

      try {
        const { added: deltaAdded, failed: deltaFailed } =
          await processContributor(username);
        added += deltaAdded;
        failed += deltaFailed;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Re-throw system-level errors (rate limit, network, SIGINT)
        console.error(`💥 System error processing ${username}:`, message);
        throw error;
      }
    }

    return { added, failed, processed };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("\n💥 Fatal error in main execution:", message);
    console.error("🛑 Script execution stopped");
    throw error;
  }
};

/**
 * Print a summary report of the run.
 */
const printSummaryReport = (results: {
  processed: number;
  added: number;
  failed: number;
}): void => {
  const { added, failed, processed } = results;

  console.log("\n" + "=".repeat(50));
  console.log("📊 EXECUTION SUMMARY");
  console.log("=".repeat(50));

  console.log(`📋 Total contributors processed: ${processed}`);
  console.log(`✅ Successfully added: ${added}`);
  console.log(`❌ Failed to add: ${failed}`);

  if (processed === 0) {
    console.log(
      "\n🎉 SUCCESS: No missing contributors found - all contributors are properly recognized!",
    );
  } else if (failed === 0) {
    console.log(
      "\n🎉 SUCCESS: All missing contributors have been successfully added!",
    );
    console.log(
      "💡 Next steps: Review the updated .all-contributorsrc file and commit the changes.",
    );
  } else if (added > 0) {
    console.log(
      "\n⚠️  PARTIAL SUCCESS: Some contributors were added, but some failed.",
    );
    console.log(`💡 ${added} contributors were successfully added.`);
    console.log(
      `🔄 ${failed} contributors failed - check the error messages above for details.`,
    );
    console.log(
      "💡 You may want to run the script again to retry failed contributors.",
    );
  } else {
    console.log("\n❌ FAILURE: No contributors could be added.");
    console.log(
      "💡 Check the error messages above for troubleshooting guidance.",
    );
    console.log(
      "💡 Common issues: missing GITHUB_TOKEN, network problems, or API rate limits.",
    );
  }

  console.log("\n📝 ACTIONABLE NEXT STEPS:");
  if (added > 0) {
    console.log("• Review the updated .all-contributorsrc file");
    console.log("• Commit and push the changes to update the README");
    console.log(
      '• Consider running "npm run contributors:generate" to update the README',
    );
  }
  if (failed > 0) {
    console.log("• Check error messages above for specific failure reasons");
    console.log("• Verify GITHUB_TOKEN is set and has appropriate permissions");
    console.log("• Consider running the script again after resolving issues");
  }
  if (processed === 0) {
    console.log(
      "• No action needed - all contributors are already recognized!",
    );
  }

  console.log("\n" + "=".repeat(50));
};

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  try {
    const results = await main();
    printSummaryReport(results);

    if (results.failed > 0 && results.added === 0) {
      process.exit(1);
    } else if (results.failed > 0) {
      process.exit(2);
    } else {
      process.exit(0);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("\n💥 Script execution failed:", message);
    console.log("\n📝 TROUBLESHOOTING TIPS:");
    console.log("• Ensure you are in a git repository");
    console.log("• Verify all-contributors-cli is installed");
    console.log("• Check that .all-contributorsrc file exists");
    console.log("• Ensure GITHUB_TOKEN environment variable is set");
    process.exit(1);
  }
}
