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
  let linkText = "🔗 <b>View Repository</b>";
  if (entry.repo.includes("gist.github.com")) {
    linkText = "🔗 <b>View Gist</b>";
  } else if (entry.repo.includes("/discussions/")) {
    linkText = "🔗 <b>View Discussion</b>";
  }

  const isGist = entry.repo.includes("gist.github.com");
  const isDiscussion = entry.repo.includes("/discussions/");
  const repoMatch = entry.repo.match(/github\.com\/(?!gist\.)([^/]+)\/([^/]+)/);

  let summaryContent = `<b>${entry.name}</b>`;

  if (repoMatch && !isGist && !isDiscussion) {
    const owner = repoMatch[1];
    const repo = repoMatch[2].replace(/\.git$/, "").replace(/\/$/, "");
    const starBadge = `https://badgen.net/github/stars/${owner}/${repo}`;
    summaryContent += ` <img src="${starBadge}" height="14"/>`;
  }

  summaryContent += ` - <i>${entry.tagline}</i>`;

  return `<details>
  <summary>${summaryContent}</summary>
  <blockquote>
    ${entry.description}
    <br><br>
    <a href="${entry.repo}">${linkText}</a>
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
