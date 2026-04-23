---
description: Performance guidelines for the Banking project
applyTo: "**/*"
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Performance Guidelines

- Cache expensive DB queries and use pagination for large result sets.
- Avoid unnecessary client bundles: mark components as server when possible.
- Measure impact before optimizing; add benchmarks for critical paths.
- Use incremental static generation and edge caching where appropriate.
