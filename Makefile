.DEFAULT_GOAL := help
STOW_DIR := .opencode
TARGET := $(HOME)/.config/opencode
STOW := $(shell command -v stow 2>/dev/null)

.PHONY: help
help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Project Lifecycle

.PHONY: install
install: ## Install dependencies (bun install)
	bun install

.PHONY: dev
dev: ## Start the development server (port 3000)
	bun run dev

.PHONY: build
build: ## Production build (runs clean + type-check first)
	bun run build

.PHONY: test
test: ## Run unit tests (Vitest)
	bun run test:browser

.PHONY: test-e2e
test-e2e: ## Run E2E tests (Playwright)
	bun run test:ui

.PHONY: lint
lint: ## Lint in strict mode (no warnings allowed)
	bun run lint:strict

.PHONY: format
format: ## Format with Prettier
	bun run format

.PHONY: type-check
type-check: ## TypeScript strict type check
	bun run type-check

.PHONY: verify
verify: ## AST policy enforcement (verify:rules)
	bun run verify:rules

.PHONY: validate
validate: ## Full pre-release validation (build + lint + tests)
	bun run validate

.PHONY: db-push
db-push: ## Push Drizzle schema to Postgres
	bun run db:push

.PHONY: db-seed
db-seed: ## Seed the database with test data
	bun run db:seed

.PHONY: clean
clean: ## Remove build artifacts (.next, dist, coverage, etc.)
	bun run clean

.PHONY: check
check: ## Quick pre-PR check: format + type-check + lint + verify
	bun run format && bun run type-check && bun run lint:strict && bun run verify:rules

##@ OpenCode Configuration

.PHONY: opencode-check
opencode-check: ## Verify opencode stow setup
	@test -d $(STOW_DIR) || (echo "Error: $(STOW_DIR) directory not found" && exit 1)
ifdef STOW
	@echo "✓ Using stow: $(STOW)"
	@test -f .stowrc || (echo "Warning: .stowrc not found")
else
	@echo "⚠ stow not found - will use ln -s instead"
endif
	@echo "✓ Setup verified"

.PHONY: opencode-install
opencode-install: opencode-check ## Install opencode configuration
	@mkdir -p $(TARGET)
ifdef STOW
	@echo "Installing with stow..."
	@stow */ || (echo "✗ Stow failed - check for conflicts" && exit 1)
else
	@echo "Installing with ln -s..."
	@$(MAKE) -s opencode-install-ln
endif
	@echo "✓ Installation complete"

.PHONY: opencode-install-ln
opencode-install-ln: ## Install opencode config using ln -s (internal)
	@mkdir -p $(TARGET)
	@for dir in $(STOW_DIR)/*/; do \
		package=$$(basename "$$dir"); \
		target_link="$(TARGET)/$$package"; \
		if [ -e "$$target_link" ] && [ ! -L "$$target_link" ]; then \
			echo "  ✗ $$package exists and is not a symlink - skipping"; \
		else \
			ln -sfn "$(CURDIR)/$$dir" "$$target_link"; \
			echo "  ✓ $$package"; \
		fi; \
	done

.PHONY: opencode-uninstall
opencode-uninstall: ## Uninstall opencode configuration
ifdef STOW
	@echo "Uninstalling with stow..."
	@stow -D */ 2>/dev/null || true
else
	@echo "Removing symlinks..."
	@$(MAKE) -s opencode-uninstall-ln
endif
	@echo "✓ Uninstallation complete"

.PHONY: opencode-uninstall-ln
opencode-uninstall-ln: ## Uninstall opencode config using rm (internal)
	@for dir in $(STOW_DIR)/*/; do \
		package=$$(basename "$$dir"); \
		target_link="$(TARGET)/$$package"; \
		if [ -L "$$target_link" ]; then \
			echo "  Removing $$package..."; \
			rm -f "$$target_link"; \
		fi; \
	done

.PHONY: opencode-restow
opencode-restow: ## Restow opencode configuration
ifdef STOW
	@echo "Restowing with stow..."
	@stow -R */ || (echo "✗ Restow failed - check for conflicts" && exit 1)
else
	@echo "Refreshing symlinks..."
	@$(MAKE) -s opencode-uninstall-ln opencode-install-ln
endif
	@echo "✓ Restow complete"

##@ Utilities

.PHONY: status
status: ## Show opencode installation status
	@echo "Installation method: $(if $(STOW),stow,ln -s)"
	@echo "Target: $(TARGET)"
	@echo ""
	@echo "Installed packages:"
	@if [ -d "$(TARGET)" ]; then \
		for link in $(TARGET)/*; do \
			if [ -L "$$link" ]; then \
				target=$$(readlink "$$link"); \
				echo "  ✓ $$(basename $$link) -> $$target"; \
			elif [ -e "$$link" ]; then \
				echo "  ⚠ $$(basename $$link) (not a symlink)"; \
			fi; \
		done | sort; \
	else \
		echo "  Not installed"; \
	fi

.PHONY: list
list: ## List available opencode packages
	@echo "Available packages:"
	@ls -d $(STOW_DIR)/*/ 2>/dev/null | sed 's|$(STOW_DIR)/||g; s|/$$||' | sed 's/^/  /' || echo "  None found"

.PHONY: db-migrate
db-migrate: ## Apply all SQL migrations
	bunx tsx scripts/db/apply-migrations.ts

.PHONY: db-migrate-dry
db-migrate-dry: ## Dry-run: show migrations that would be applied
	bunx tsx scripts/db/apply-migrations.ts --dry-run

.PHONY: db-seed-reset
db-seed-reset: ## Reset and re-seed the database (destructive)
	bun run db:seed -- --reset --yes

.PHONY: lint-fix
lint-fix: ## Lint with auto-fix
	bun run lint:fix

.PHONY: format-check
format-check: ## Check formatting without applying changes
	bun run format:check

.PHONY: plugins-verify
plugins-verify: ## Verify OpenCode plugins
	bunx tsx scripts/ts/plugin-verify.ts

.PHONY: plugins-repair
plugins-repair: ## Repair OpenCode plugins (dry-run by default)
	bunx tsx scripts/ts/plugin-repair.ts

.PHONY: plugins-repair-apply
plugins-repair-apply: ## Repair OpenCode plugins (apply changes)
	bunx tsx scripts/ts/plugin-repair.ts --apply

.PHONY: codemod-dry
codemod-dry: ## Dry-run zod meta-to-describe codemod
	bunx tsx scripts/transform/zod-meta-to-describe.ts --dry-run

.PHONY: codemod-apply
codemod-apply: ## Apply zod meta-to-describe codemod
	bunx tsx scripts/transform/zod-meta-to-describe.ts --apply

##@ Pre-commit Hooks

.PHONY: install-hooks
install-hooks: ## Install pre-commit hooks
	@command -v pre-commit >/dev/null 2>&1 || \
		(echo "❌ pre-commit not installed. Install with: pip install pre-commit" && exit 1)
	@pre-commit install
	@echo "✓ Pre-commit hooks installed"

.PHONY: uninstall-hooks
uninstall-hooks: ## Uninstall pre-commit hooks
	@pre-commit uninstall
	@echo "✓ Pre-commit hooks uninstalled"

.PHONY: run-hooks
run-hooks: ## Run pre-commit hooks manually
	@pre-commit run --all-files

.PHONY: update-hooks
update-hooks: ## Update pre-commit hooks to latest versions
	@pre-commit autoupdate
	@echo "✓ Pre-commit hooks updated"
