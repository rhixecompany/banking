# Context Harvest Workflow

## Overview
Extract knowledge from CONTINUITY ledger files and create permanent context, then clean up workspace.

## Constraints
- Files MUST be <200 lines (MVI strict)
- ALWAYS present approval UI before deleting files
- Function-based structure: concepts/, examples/, guides/, lookup/, errors/
- Lazy load: Read required context files from .opencode/context/core/context-system/ BEFORE executing

## 6-Stage Workflow

### Stage 1: Scan
- Find all CONTINUITY files in workspace
- Categorize by type (SUMMARY vs CONTINUITY)

### Stage 2: Analyze
- Read ledger content
- Identify key knowledge: goals, constraints, progress, decisions, next steps

### Stage 3: Extract
- Map content to context categories
- Format per MVI (<200 lines per file)

### Stage 4: Place
- Create/place in permanent context structure
- Use appropriate folder (concepts/, guides/, etc.)

### Stage 5: Confirm
- Present approval UI before deletion
- Never delete without explicit user approval

### Stage 6: Cleanup
- Execute deletion of harvested ledger files
- Verify final structure meets requirements

## MVI Format Rules

- Maximum 200 lines per file
- Clear metadata header
- Organized sections: Overview, Details, Examples, References
- Use bullet points for readability

## Key Learnings

- Code cleanup should run BEFORE harvest to ensure production readiness
- Context limit may hit during analysis - need to compress mid-operation
- Lazy loading harvest.md is mandatory per constraints
- User approval required at every deletion point