/**
 * Template rendering utilities for awesome-opencode
 */

import fs from "fs";
import path from "path";

import { ROOT_FOLDER } from "./constants.js";

/**
 * Read the README template
 */
export function readTemplate(): string {
  const templatePath = path.join(ROOT_FOLDER, "templates/README.template.md");
  return fs.readFileSync(templatePath, "utf8");
}

/**
 * Replace a placeholder in the template
 */
export function replacePlaceholder(
  template: string,
  placeholder: string,
  content: string,
): string {
  const pattern = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g");
  return template.replace(pattern, content);
}

/**
 * Generate HTML for a single entry
 */
export function generateEntryHtml(entry: {
  name: string;
  repo: string;
  tagline: string;
  description: string;
}): string {
  // Check if this is a local .opencode entry (not a GitHub URL)
  const isLocalOpenCode =
    entry.repo.startsWith(".opencode/") ||
    entry.repo.startsWith("/.opencode/") ||
    entry.repo.includes("opencode/skills") ||
    entry.repo.includes("opencode/instructions");

  let linkText: string;
  let linkHtml: string;

  if (isLocalOpenCode) {
    // Local file - show as local path
    linkText = "📁 <b>Local File</b>";
    linkHtml = `<span class="local-path">${entry.repo}</span>`;
  } else if (entry.repo.includes("gist.github.com")) {
    linkText = "🔗 <b>View Gist</b>";
    linkHtml = `<a href="${entry.repo}">${linkText}</a>`;
  } else if (entry.repo.includes("/discussions/")) {
    linkText = "🔗 <b>View Discussion</b>";
    linkHtml = `<a href="${entry.repo}">${linkText}</a>`;
  } else if (entry.repo) {
    linkText = "🔗 <b>View Repository</b>";
    linkHtml = `<a href="${entry.repo}">${linkText}</a>`;
  } else {
    linkText = "";
    linkHtml = "";
  }

  const isGist = entry.repo.includes("gist.github.com");
  const isDiscussion = entry.repo.includes("/discussions/");
  const repoMatch = entry.repo.match(/github\.com\/(?!gist\.)([^/]+)\/([^/]+)/);

  let summaryContent = `<b>${entry.name}</b>`;

  // Only show GitHub stars for remote repos, not local
  if (repoMatch && !isGist && !isDiscussion && !isLocalOpenCode) {
    const owner = repoMatch[1];
    const repo = repoMatch[2].replace(/\.git$/, "").replace(/\/$/, "");
    const starBadge = `https://badgen.net/github/stars/${owner}/${repo}`;
    summaryContent += ` <img src="${starBadge}" height="14"/>`;
  }

  // Add local indicator for .opencode entries
  if (isLocalOpenCode) {
    summaryContent += ` <span title="Local .opencode entry">📂</span>`;
  }

  summaryContent += ` - <i>${entry.tagline}</i>`;

  return `<details>
  <summary>${summaryContent}</summary>
  <blockquote>
    ${entry.description}
    ${linkHtml ? `<br><br>${linkHtml}` : ""}
  </blockquote>
</details>`;
}

/**
 * Write the final README
 */
export function writeReadme(content: string): void {
  const readmePath = path.join(ROOT_FOLDER, "README.opencode.md");
  fs.writeFileSync(readmePath, content, "utf8");
}
