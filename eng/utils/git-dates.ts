#!/usr/bin/env node

/**
 * Utility to extract last modification dates from git history.
 * Uses a single git log command for efficiency.
 */

import { execSync } from "child_process";

/**
 * Get the last modification date for all tracked files in specified directories.
 * Returns a Map of file path -> ISO date string.
 *
 * @param directories - Array of directory paths to scan
 * @param rootDir - Root directory for relative paths
 * @returns Map of relative file path to ISO date string
 */
export function getGitFileDates(
  directories: string[],
  rootDir: string,
): Map<string, string> {
  const fileDates = new Map<string, string>();

  try {
    // Get git log with file names for all specified directories
    // Format: ISO date, then file names that were modified in that commit
    const gitArgs = [
      "--no-pager",
      "log",
      "--format=%aI", // Author date in ISO 8601 format
      "--name-only",
      "--diff-filter=ACMR", // Added, Copied, Modified, Renamed
      "--",
      ...directories,
    ];

    const output = execSync(`git ${gitArgs.join(" ")}`, {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Parse the output: alternating date lines and file name lines
    // Format is:
    // 2026-01-15T10:30:00+00:00
    //
    // file1.md
    // file2.md
    //
    // 2026-01-14T09:00:00+00:00
    // ...

    let currentDate: null | string = null;
    const lines = output.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        continue;
      }

      // Check if this is a date line (ISO 8601 format)
      if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
        currentDate = trimmed;
      } else if (currentDate && trimmed) {
        // This is a file path - only set if we haven't seen this file yet
        // (first occurrence is the most recent modification)
        if (!fileDates.has(trimmed)) {
          fileDates.set(trimmed, currentDate);
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Git command failed - might not be a git repo or no history
    console.warn("Warning: Could not get git dates:", message);
  }

  return fileDates;
}

/**
 * Get the last modification date for a single file.
 *
 * @param filePath - Path to the file (relative to git root)
 * @param rootDir - Root directory
 * @returns ISO date string or null if not found
 */
export function getGitFileDate(
  filePath: string,
  rootDir: string,
): null | string {
  try {
    const output = execSync(
      `git --no-pager log -1 --format="%aI" -- "${filePath}"`,
      {
        cwd: rootDir,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    const date = output.trim();
    return date || null;
  } catch {
    return null;
  }
}
