## Pull Request Checklist

- [ ] I have read and followed the [CONTRIBUTING.md](https://github.com/github/awesome-copilot/blob/main/CONTRIBUTING.md) guidelines.
- [ ] I have read and followed the [Guidance for submissions involving paid services](https://github.com/github/awesome-copilot/discussions/968).
- [ ] My contribution adds a new instruction, prompt, agent, skill, or workflow file in the correct directory.
- [ ] The file follows the required naming convention.
- [ ] The content is clearly structured and follows the example format.
- [ ] I have tested my instructions, prompt, agent, skill, or workflow with GitHub Copilot.
- [ ] I have run `npm start` and verified that `README.md` is up to date.
- [ ] I am targeting the `staged` branch for this pull request.

---

### CI E2E label

- This repository may skip expensive E2E checks for PRs coming from forks. To request that maintainers run the full E2E suite (Playwright), add the label `run-e2e` to your PR or ask a maintainer to add it.
- Maintainers can add `run-e2e` to trigger the full verify-agents workflow including Playwright E2E.
- This repository may skip expensive E2E checks for PRs coming from forks. To request that maintainers run the full E2E suite (Playwright), add the label `run-e2e` to your PR or ask a maintainer to add it.
- Maintainers can add `run-e2e` to trigger the full verify-agents workflow including Playwright E2E. If you do not have write access, request one of the maintainers listed in CONTRIBUTING.md to add the label or comment `/run-e2e`.

## Description

<!-- Briefly describe your contribution and its purpose. Include any relevant context or usage notes. -->

---

## Type of Contribution

- [ ] New instruction file.
- [ ] New prompt file.
- [ ] New agent file.
- [ ] New plugin.
- [ ] New skill file.
- [ ] New agentic workflow.
- [ ] Update to existing instruction, prompt, agent, plugin, skill, or workflow.
- [ ] Other (please specify):

---

## Additional Notes

<!-- Add any additional information or context for reviewers here. -->

---

By submitting this pull request, I confirm that my contribution abides by the [Code of Conduct](../CODE_OF_CONDUCT.md) and will be licensed under the MIT License.
