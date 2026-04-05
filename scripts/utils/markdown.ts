/**
 * Markdown utilities for parsing .opencode skills and instructions
 */

import fs from "fs";
import { glob } from "glob";
import yaml from "js-yaml";
import path from "path";

import type { Entry } from "../types/index.js";

import { INSTRUCTIONS_DIR, SKILLS_DIR } from "./constants.js";

/**
 * Convert kebab-case to PascalCase
 * e.g., "auth-skill" -> "AuthSkill", "db-skill" -> "DbSkill"
 */
export function toPascalCase(str: string): string {
  return str
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Extract frontmatter and content from markdown file
 * Returns { frontmatter: object, content: string }
 */
function extractFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const frontmatterRegex = /^---\n([\s\S]*?)---/;
  const match = content.match(frontmatterRegex);

  if (match) {
    try {
      const frontmatter = yaml.load(match[1]) as Record<string, unknown>;
      const body = content.slice(match[0].length);
      return { content: body, frontmatter };
    } catch {
      // Invalid YAML, treat as no frontmatter
      return { content, frontmatter: {} };
    }
  }

  return { content, frontmatter: {} };
}

/**
 * Extract tagline and description from markdown content
 * Returns { tagline, description }
 */
function extractContentMeta(content: string): {
  tagline: string;
  description: string;
} {
  const lines = content.split("\n").filter((line) => line.trim());

  // First non-empty line after frontmatter is usually the title or description
  let tagline = "";
  let description = "";
  let foundFirstParagraph = false;

  for (const line of lines) {
    // Skip headers
    if (line.startsWith("#")) continue;

    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!foundFirstParagraph) {
      // First meaningful text - use as tagline (truncated if needed)
      tagline = trimmed.length > 120 ? trimmed.slice(0, 117) + "..." : trimmed;
      foundFirstParagraph = true;
    } else if (description.length < 500) {
      // Subsequent text - append to description
      const toAdd = " " + trimmed;
      if (description.length + toAdd.length <= 500) {
        description += toAdd;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return {
    description: description.trim(),
    tagline: tagline || "No description available",
  };
}

/**
 * Read and parse a single markdown file
 * Supports both .md files in folders (skills) and flat .md files (instructions)
 */
export function readMarkdownFile(
  filePath: string,
  options?: { category?: "instructions" | "skills" },
): Entry | null {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { content: body, frontmatter } = extractFrontmatter(content);
    const { description, tagline } = extractContentMeta(body);

    // For skills: directory name (e.g., "auth-skill" from "skills/auth-skill/SKILL.md")
    // For instructions: filename without extension (e.g., "01-core-standards" from "instructions/01-core-standards.md")
    const isSkill = options?.category === "skills";
    const fileName = isSkill
      ? path.basename(path.dirname(filePath))
      : path.basename(filePath, path.extname(filePath));

    // Determine name: from frontmatter or filename
    const name = (frontmatter.name as string) || toPascalCase(fileName);

    // Determine description: from frontmatter or content
    const finalDescription =
      (frontmatter.description as string) ||
      description ||
      "No description available";

    // Determine tagline: from frontmatter or content
    const finalTagline =
      (frontmatter.tagline as string) || tagline || "No tagline available";

    // Build repo path relative to project root
    const relativePath =
      path.relative(process.cwd(), path.dirname(filePath)) + "/";

    return {
      _fileName: toPascalCase(fileName),
      _filePath: filePath,
      description: finalDescription.slice(0, 500),
      name,
      repo: relativePath,
      scope: ["project"],
      tagline: finalTagline.slice(0, 120),
      tags: ["opencode", options?.category ?? "unknown"],
    } as Entry;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error processing markdown file ${filePath}: ${message}`);
    return null;
  }
}

/**
 * Read all skill markdown files from .opencode/skills/
 * Looks for SKILL.md files in subdirectories
 */
export async function readSkillsDir(): Promise<Entry[]> {
  const pattern = path.join(SKILLS_DIR, "*/SKILL.md").replaceAll("\\", "/");
  const files = await glob(pattern);

  const entries: Entry[] = [];

  for (const file of files) {
    const entry = readMarkdownFile(file, { category: "skills" });
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Read all instruction markdown files from .opencode/instructions/
 * Looks for *.md files directly in the directory
 */
export async function readInstructionsDir(): Promise<Entry[]> {
  const pattern = path.join(INSTRUCTIONS_DIR, "*.md").replaceAll("\\", "/");
  const files = await glob(pattern);

  const entries: Entry[] = [];

  for (const file of files) {
    const entry = readMarkdownFile(file, { category: "instructions" });
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Read both skills and instructions and return combined entries
 */
export async function readOpenCodeEntries(): Promise<Entry[]> {
  const [skills, instructions] = await Promise.all([
    readSkillsDir(),
    readInstructionsDir(),
  ]);

  return [...skills, ...instructions];
}
