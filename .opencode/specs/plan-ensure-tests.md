# Spec: plan-ensure-tests

Scope: repo

# Coverage: plan-ensure.ts

## Current State

- plan-ensure.ts at 15.38% Statements, 15.75% Lines (464 lines total)
- Stub test at plan-ensure.match.test.ts (1 placeholder assertion)
- Partial test at plan-ensure.scoring.test.ts (1 real test for scoreCandidate)

## Target Coverage: 40%+ (REALISTIC - exported functions only)

## Functions to Cover (2 exported, testable functions)

1. readPlanFile(path) - parses .plan.md file, extracts title/goals/targetFiles metadata
2. scoreCandidate(changed, candidate) - returns 0-1 relevance score for plan matching

## NOT Covered (internal CLI functions, hard to unit test)

- main() - orchestration, git commands, interactive prompts
- getChangedFilesFromGit() - shell interaction
- scaffoldNewPlan() - file creation, editor invocation
- openEditorAndSave() - readline/child_process
- buildPlanTemplate() - markdown generation

## Test Pattern

- Test readPlanFile with real .plan.md files (sample fixtures)
- Test scoreCandidate with various changed file lists and plan candidates
- Test scoring logic: prefix matching, targetFiles matching, edge cases
- No need to mock fs - use real fixtures or vi.mock minimal parts

## Notes

- This is a script with mostly internal functions
- 40% target achieved by thoroughly testing the 2 exportable functions
- CLI entry point (main) is not unit-testable without extensive mocking
- Keep tests focused on pure functions that have clear inputs/outputs
