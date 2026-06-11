# Section 10 — CI Validation

CI must run `npm run type-check`, `npm run lint:strict`, and `npm run test`. Keep jobs minimal and only expose secrets to trusted jobs.

Example (GitHub Actions):

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint:strict
```
