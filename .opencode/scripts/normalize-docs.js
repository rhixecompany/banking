#!/usr/bin/env node
/**
 * normalize-docs.js
 * Insert lastReviewed metadata into front-matter of instruction and SKILL.md files
 * and perform conservative normalization (no destructive edits).
 */
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const REVIEW_DATE = "2026-04-13";

function processFile(file) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.startsWith("---")) return false;
  const endIndex = content.indexOf("\n---", 3);
  if (endIndex === -1) return false;
  const fmBlock = content.slice(3, endIndex + 1); // includes leading newline
  if (/lastReviewed:/i.test(fmBlock)) return false; // already present
  const insertPos = endIndex + 1; // after closing --- line
  // build new front-matter by inserting lastReviewed before closing ---
  const fmLines = fmBlock.split(/\r?\n/);
  // Remove any trailing empty lines
  while (fmLines.length && fmLines[fmLines.length - 1].trim() === "")
    fmLines.pop();
  fmLines.push(`lastReviewed: ${REVIEW_DATE}`);
  const newFm = "---\n" + fmLines.join("\n") + "\n---\n";
  const rest = content.slice(endIndex + 5); // skip \n---\n
  const newContent = newFm + rest;
  fs.writeFileSync(file, newContent, "utf8");
  return true;
}

function run() {
  const instrFiles = glob.sync(".opencode/instructions/*.md");
  const skillFiles = glob.sync(".opencode/skills/**/SKILL.md");
  const files = instrFiles.concat(skillFiles);
  const updated = [];
  for (const f of files) {
    try {
      const changed = processFile(f);
      if (changed) updated.push(f);
    } catch (err) {
      console.error("ERR", f, err.message);
    }
  }
  console.log("Normalized files:", updated.length);
  for (const u of updated) console.log(" -", u);
}

run();
