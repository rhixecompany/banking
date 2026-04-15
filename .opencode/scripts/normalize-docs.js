#!/usr/bin/env node
/**
 * normalize-docs.js
 * Insert lastReviewed metadata into front-matter of instruction and SKILL.md files
 * and perform conservative normalization (no destructive edits).
 */
const fs = require("fs");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const path = require("path");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const glob = require("glob");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"2026-04-13"}
 */
const REVIEW_DATE = "2026-04-13";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {*} file
 * @returns {boolean}
 */
function processFile(file) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.startsWith("---")) return false;
  // Use a robust regex to capture front-matter including CRLF or LF line endings
  const fmRegex = /^(---\r?\n([\s\S]*?)\r?\n---\r?\n)/;
  const m = content.match(fmRegex);
  if (!m) return false;
  const fullFmBlock = m[1]; // includes opening and closing --- lines
  const innerFm = m[2];
  if (/lastReviewed:/i.test(innerFm)) return false; // already present
  // build new front-matter by appending lastReviewed before closing ---
  const fmLines = innerFm.split(/\r?\n/).filter(Boolean);
  fmLines.push(`lastReviewed: ${REVIEW_DATE}`);
  const newFm = `---\n${fmLines.join("\n")}\n---\n`;
  const rest = content.slice(fullFmBlock.length);
  const newContent = newFm + rest;
  fs.writeFileSync(file, newContent, "utf8");
  return true;
}

/**
 * Description placeholder
 * @author Adminbot
 */
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
