# Section 10 — CI Validation

CI must run `bun run type-check`, `bun run lint:strict`, and `bun run test`. Keep jobs minimal and only expose secrets to trusted jobs.

Example (GitHub Actions):

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun install --frozen-lockfile
      - run: bun run type-check
      - run: bun run lint:strict
```
